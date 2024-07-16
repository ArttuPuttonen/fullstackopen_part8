import React, { useState } from 'react';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import CreateUser from './components/CreateUser';
import LoginForm from './components/LoginForm';
import RecommendedBooks from './components/RecommendedBooks';

const App = () => {
  const [page, setPage] = useState('authors');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('library-user-token'));

  const handleLogin = (token) => {
    setIsLoggedIn(true);
    setToken(token);
    localStorage.setItem('library-user-token', token);
    setPage('add');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setToken(null);
    localStorage.removeItem('library-user-token');
    setPage('authors');
  };

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

      <Authors show={page === 'authors'} isLoggedIn={isLoggedIn} />
      <Books show={page === 'books'} />
      <NewBook show={page === 'add'} isLoggedIn={isLoggedIn} />
      <RecommendedBooks show={page === 'recommended'} />
      {page === 'createUser' && <CreateUser />}
      {page === 'login' && <LoginForm setToken={handleLogin} setPage={setPage} />}
    </div>
  );
};

export default App;
