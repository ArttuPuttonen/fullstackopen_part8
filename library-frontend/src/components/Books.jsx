import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { ALL_BOOKS, ALL_GENRES } from '../queries';

const Books = ({ show }) => {
  const [genre, setGenre] = useState('');
  const { loading, error, data, refetch } = useQuery(ALL_BOOKS, {
    variables: { genre },
  });
  const { loading: genresLoading, data: genresData } = useQuery(ALL_GENRES);

  useEffect(() => {
    refetch({ genre });
  }, [genre, refetch]);

  if (!show) {
    return null;
  }

  if (loading || genresLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const books = data.allBooks;
  const genres = genresData.allGenres;

  return (
    <div>
      <h2>Books</h2>
      <div>
        <label>
          Filter by Genre:
          <select value={genre} onChange={(e) => setGenre(e.target.value)}>
            <option value="">All</option>
            {genres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
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
