import { gql } from '@apollo/client';

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`;

export const ALL_BOOKS = gql`
  query allBooks($genre: String) {
    allBooks(genre: $genre) {
      title
      published
      author {
        name
      }
      genres
    }
  }
`;

export const RECOMMENDED_BOOKS = gql`
  query {
    recommendedBooks {
      title
      published
      author {
        name
      }
      genres
    }
  }
`;

export const ADD_BOOK = gql`
  mutation addBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
    addBook(title: $title, author: $author, published: $published, genres: $genres) {
      title
      author {
        name
      }
      published
      genres
    }
  }
`;

export const EDIT_AUTHOR = gql`
    mutation editAuthor($name: String!, $setBornTo: Int!) {
        editAuthor(name: $name, setBornTo: $setBornTo) {
        name
        born
        bookCount
        }
    }
    `;

export const CREATE_USER = gql`
  mutation createUser($username: String!, $favoriteGenre: String!, $password: String!) {
    createUser(
      username: $username
      favoriteGenre: $favoriteGenre
      password: $password
    ) {
      username
      favoriteGenre
    }
  }
`;

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(
      username: $username
      password: $password
    ) {
      value
    }
  }
`;

export const BOOKS_BY_GENRE = gql`
  query booksByGenre($genre: String!) {
    allBooks(genre: $genre) {
      title
      published
      author {
        name
      }
      genres
    }
  }
`;

export const ALL_GENRES = gql`
  query {
    allGenres
  }
`;