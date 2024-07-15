import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN } from '../queries';

const Login = ({ setToken, show }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [login, { data }] = useMutation(LOGIN);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const result = await login({
        variables: { username, password },
      });

      const token = result.data.login.value;
      setToken(token);
      localStorage.setItem('user-token', token);

      setUsername('');
      setPassword('');
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  if (!show) {
    return null;
  }

  return (
    <div>
      <form onSubmit={handleLogin}>
        <div>
          Username
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          Password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
