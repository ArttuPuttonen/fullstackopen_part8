import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_BOOK } from '../queries';

const NewBook = ({ show, isLoggedIn }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [published, setPublished] = useState('');
  const [genres, setGenres] = useState([]);
  const [genre, setGenre] = useState('');

  const [addBook] = useMutation(ADD_BOOK);

  if (!show) {
    return null;
  }

  const submit = async (event) => {
    event.preventDefault();

    await addBook({
      variables: { title, author, published: parseInt(published), genres },
    });

    setTitle('');
    setPublished('');
    setAuthor('');
    setGenres([]);
    setGenre('');
  };

  return (
    <div>
      <h2>Add Book</h2>
      {isLoggedIn ? (
        <form onSubmit={submit}>
          <div>
            title <input value={title} onChange={({ target }) => setTitle(target.value)} />
          </div>
          <div>
            author <input value={author} onChange={({ target }) => setAuthor(target.value)} />
          </div>
          <div>
            published <input value={published} onChange={({ target }) => setPublished(target.value)} />
          </div>
          <div>
            <input
              value={genre}
              onChange={({ target }) => setGenre(target.value)}
            />
            <button
              type="button"
              onClick={() => {
                setGenres(genres.concat(genre));
                setGenre('');
              }}
            >
              add genre
            </button>
          </div>
          <div>genres: {genres.join(' ')}</div>
          <button type="submit">create book</button>
        </form>
      ) : (
        <p>You must be logged in to add a book.</p>
      )}
    </div>
  );
};

export default NewBook;
