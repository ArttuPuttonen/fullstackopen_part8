require('dotenv').config();
const mongoose = require('mongoose');
const Author = require('./models/author');
const Book = require('./models/book');

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB');

    await Author.deleteMany({});
    await Book.deleteMany({});

    const authors = [
      { name: 'Robert Martin', born: 1952 },
      { name: 'Martin Fowler', born: 1963 },
      { name: 'Fyodor Dostoevsky', born: 1821 },
      { name: 'Joshua Kerievsky' },
      { name: 'Sandi Metz' }
    ];

    const savedAuthors = await Author.insertMany(authors);

    const books = [
      { title: 'Clean Code', published: 2008, author: savedAuthors[0]._id, genres: ['refactoring'] },
      { title: 'Agile software development', published: 2002, author: savedAuthors[0]._id, genres: ['agile', 'patterns', 'design'] },
      { title: 'Refactoring, edition 2', published: 2018, author: savedAuthors[1]._id, genres: ['refactoring'] },
      { title: 'Refactoring to patterns', published: 2008, author: savedAuthors[3]._id, genres: ['refactoring', 'patterns'] },
      { title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby', published: 2012, author: savedAuthors[4]._id, genres: ['refactoring', 'design'] },
      { title: 'Crime and punishment', published: 1866, author: savedAuthors[2]._id, genres: ['classic', 'crime'] },
      { title: 'Demons', published: 1872, author: savedAuthors[2]._id, genres: ['classic', 'revolution'] }
    ];

    await Book.insertMany(books);

    console.log('Data initialized');
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
    mongoose.connection.close();
  });