import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries';

const Authors = ({ show, isLoggedIn }) => {
  const { loading, error, data } = useQuery(ALL_AUTHORS);
  const [name, setName] = useState('');
  const [born, setBorn] = useState('');
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  if (!show) {
    return null;
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const authors = data.allAuthors;

  const submit = async (event) => {
    event.preventDefault();

    await editAuthor({ variables: { name, setBornTo: parseInt(born) } });

    setName('');
    setBorn('');
  };

  return (
    <div>
      <h2>Authors</h2>
      <table>
        <tbody>
          <tr>
            <th>Name</th>
            <th>Born</th>
            <th>Books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {isLoggedIn && (
        <div>
          <h3>Set birthyear</h3>
          <form onSubmit={submit}>
            <div>
              Name
              <select value={name} onChange={({ target }) => setName(target.value)}>
                {authors.map((a) => (
                  <option key={a.name} value={a.name}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              Born
              <input
                type="number"
                value={born}
                onChange={({ target }) => setBorn(target.value)}
              />
            </div>
            <button type="submit">Update author</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Authors;
