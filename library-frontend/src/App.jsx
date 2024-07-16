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
  const [user, setUser] = useState(null);

  const handleLogin = (loggedInUser) => {
    setIsLoggedIn(true);
    setUser(loggedInUser);
    setPage('recommended');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
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
      {page === 'recommended' && <RecommendedBooks show={page === 'recommended'} user={user} />}
      {page === 'createUser' && <CreateUser />}
      {page === 'login' && <LoginForm setPage={setPage} onLogin={handleLogin} />}
    </div>
  );
};

export default App;
