import React, { useState } from 'react';
import { useApolloClient } from '@apollo/client';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import CreateUser from './components/CreateUser';
import LoginForm from './components/LoginForm';
import RecommendedBooks from './components/RecommendedBooks';
import { useQuery } from '@apollo/client';
import { ALL_AUTHORS } from './queries';

const App = () => {
  const [page, setPage] = useState('authors');
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('library-user-token'));
  const [token, setToken] = useState(localStorage.getItem('library-user-token'));
  const client = useApolloClient();
  
  const { loading, error, data } = useQuery(ALL_AUTHORS);

  const handleLogin = (token) => {
    setIsLoggedIn(true);
    setToken(token);
    localStorage.setItem('library-user-token', token);
    setPage('authors');
    client.resetStore();  // Clear Apollo cache
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setToken(null);
    localStorage.removeItem('library-user-token');
    setPage('authors');
    client.resetStore();  // Clear Apollo cache
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {isLoggedIn && <button onClick={() => setPage('add')}>add book</button>}
        {isLoggedIn && <button onClick={() => setPage('recommended')}>recommended books</button>}
        {isLoggedIn ? (
          <button onClick={handleLogout}>logout</button>
        ) : (
          <>
            <button onClick={() => setPage('login')}>login</button>
            <button onClick={() => setPage('createUser')}>create user</button>
          </>
        )}
      </div>

      <Authors show={page === 'authors'} authors={data.allAuthors} />
      <Books show={page === 'books'} />
      <NewBook show={page === 'add'} />
      <RecommendedBooks show={page === 'recommended'} />
      {page === 'createUser' && <CreateUser />}
      {page === 'login' && <LoginForm setToken={handleLogin} setPage={setPage} />}
    </div>
  );
};

export default App;
