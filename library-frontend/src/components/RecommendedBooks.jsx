import React, {useEffect} from 'react';
import { useQuery } from '@apollo/client';
import { RECOMMENDED_BOOKS } from '../queries';

const RecommendedBooks = ({ show }) => {
  const { loading, error, data, refetch } = useQuery(RECOMMENDED_BOOKS);

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (!show) {
    return null;
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Recommended Books</h2>
      <table>
        <tbody>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Published</th>
          </tr>
          {data.recommendedBooks.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecommendedBooks;
