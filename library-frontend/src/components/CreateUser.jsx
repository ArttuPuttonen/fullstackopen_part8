import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_USER } from '../queries'; // Import the mutation from queries.js

const CreateUser = () => {
  const [username, setUsername] = useState('');
  const [favoriteGenre, setFavoriteGenre] = useState('');
  const [password, setPassword] = useState('');

  const [createUser, { data, loading, error }] = useMutation(CREATE_USER);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUser({ variables: { username, favoriteGenre, password } });
      setUsername('');
      setFavoriteGenre('');
      setPassword('');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <h2>Create User</h2>
      <form onSubmit={handleSubmit}>
        <div>
          Username:
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          Favorite Genre:
          <input
            type="text"
            value={favoriteGenre}
            onChange={({ target }) => setFavoriteGenre(target.value)}
          />
        </div>
        <div>
          Password:
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">Create</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && <p>User created: {data.createUser.username}</p>}
    </div>
  );
};

export default CreateUser;
