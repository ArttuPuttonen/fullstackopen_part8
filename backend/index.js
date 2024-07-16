require('dotenv').config();
const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const gql = require('graphql-tag');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { UserInputError } = require('apollo-server-errors');
const Author = require('./models/author');
const Book = require('./models/book');
const User = require('./models/user');

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

const typeDefs = gql`
  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    allGenres: [String!]!
    me: User
    recommendedBooks: [Book!]!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
    createUser(
      username: String!
      favoriteGenre: String!
      password: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }
`;

const resolvers = {
  Query: {
    bookCount: async () => await Book.countDocuments(),
    authorCount: async () => await Author.countDocuments(),
    allBooks: async (parent, args) => {
      const filter = {};
      if (args.genre) {
        filter.genres = { $in: [args.genre] };
      }
      return await Book.find(filter).populate('author');
    },
    allAuthors: async () => await Author.find({}),
    allGenres: async () => {
      const books = await Book.find({});
      const genres = new Set();
      books.forEach(book => {
        book.genres.forEach(genre => genres.add(genre));
      });
      return Array.from(genres);
    },
    me: () => {
      return null; // For simplicity, return null for the 'me' query.
    },
    recommendedBooks: async (parent, args, context) => {
      const currentUser = context.currentUser;
      if (!currentUser) {
        throw new UserInputError("not authenticated");
      }
      return await Book.find({ genres: { $in: [currentUser.favoriteGenre] } }).populate('author');
    },
  },
  Author: {
    bookCount: async (parent) => await Book.countDocuments({ author: parent._id }),
  },
  Mutation: {
    addBook: async (parent, args) => {
      let author = await Author.findOne({ name: args.author });
      if (!author) {
        author = new Author({ name: args.author });
        await author.save();
      }
      const book = new Book({ ...args, author: author._id });
      await book.save();
      return book.populate('author');
    },
    editAuthor: async (parent, args) => {
      const author = await Author.findOne({ name: args.name });
      if (!author) return null;
      author.born = args.setBornTo;
      await author.save();
      return author;
    },
    createUser: async (parent, args) => {
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(args.password, saltRounds);

      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
        passwordHash
      });

      return user.save();
    },
    login: async (parent, args) => {
      const user = await User.findOne({ username: args.username });
      const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(args.password, user.passwordHash);

      if (!(user && passwordCorrect)) {
        throw new UserInputError("wrong credentials");
      }

      return { value: "dummy_token" }; // Return a dummy token for now
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), process.env.JWT_SECRET
      );
      const currentUser = await User.findById(decodedToken.id);
      return { currentUser };
    }
    return {};
  }
});

startStandaloneServer(server, {
  listen: { port: process.env.PORT || 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
