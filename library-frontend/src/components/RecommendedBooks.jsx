import React from 'react';
import { useQuery } from '@apollo/client';
import { RECOMMENDED_BOOKS } from '../queries';

const RecommendedBooks = ({ show, user }) => {
  const { loading, error, data } = useQuery(RECOMMENDED_BOOKS, {
    variables: { username: user ? user.username : '' },
  });

  if (!show) {
    return null;
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const books = data.recommendedBooks;

  return (
    <div>
      <h2>Recommended Books</h2>
      <p>Books in your favorite genre: <strong>{user.favoriteGenre}</strong></p>
      <table>
        <tbody>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Published</th>
            <th>Genres</th>
          </tr>
          {books.map((b) => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
              <td>{b.genres.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecommendedBooks;
