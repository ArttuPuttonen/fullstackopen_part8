import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { ALL_BOOKS, BOOKS_BY_GENRE } from '../queries';

const Books = ({ show }) => {
  const [genre, setGenre] = useState('');
  const { loading, error, data, refetch } = useQuery(
    genre ? BOOKS_BY_GENRE : ALL_BOOKS,
    {
      variables: { genre },
    }
  );

  if (!show) {
    return null;
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const books = data.allBooks;

  const handleGenreChange = (e) => {
    setGenre(e.target.value);
    refetch();
  };

  return (
    <div>
      <h2>Books</h2>
      <div>
        <label>
          Filter by Genre:
          <select value={genre} onChange={handleGenreChange}>
            <option value="">All</option>
            <option value="classic">Classic</option>
            <option value="fiction">Fiction</option>
            <option value="science">Science</option>
            {/* Add more genres as needed */}
          </select>
        </label>
      </div>
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

export default Books;
