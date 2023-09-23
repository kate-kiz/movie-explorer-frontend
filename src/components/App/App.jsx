import React, { useCallback, useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Main from '../Main/Main';
import Movies from '../Movies/Movies';
import SavedMovies from '../SavedMovies/SavedMovies';
import Login from '../Login/Login';
import Register from '../Register/Register';
import Profile from '../Profile/Profile';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';

import './App.css';
import { CurrentUserContext } from '../../contexts/CurrentUserContext';
import mainApi from '../../utils/MainApi';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [currentUser, setCurrentUser] = useState({});

  const checkToken = useCallback(async () => {
    try {
      const token = localStorage.getItem("jwt");
      const res = await mainApi.checkToken(token);
      console.log("check token res", res);
      if (res) {
        setIsLoggedIn(true);
        setCurrentUser(res);
      }
    }
    catch (err) {
      console.log(err);
    }
  }, []);

  const handleLogin = useCallback(async (email, password) => {
    try {
      setIsFetching(true);
      const res = await mainApi.singIn(email, password);
      localStorage.setItem("jwt", res.token);
      await checkToken();
    }
    catch (err) {
      console.log(err);
    }
    finally {
      setIsFetching(false);
    }
  }, [checkToken]);

  const handleRegister = useCallback(async (name, email, password) => {
    try {
      setIsFetching(true);

      await mainApi.signUp(name, email, password);
      await handleLogin(email, password);
    }
    catch (err) {
      console.log(err);
    }
    finally {
      setIsFetching(false);
    }
  }, [handleLogin]);

  const handleSignOut = useCallback(() => {
    setIsLoggedIn(false);
    setCurrentUser({});
    localStorage.removeItem("jwt");
  }, []);

  useEffect(() => {
    checkToken();
  }, [checkToken]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page" lang="ru">
        <Header isLoggedIn={isLoggedIn} />
        <main className='main'>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route
              path="/movies"
              element={
                <ProtectedRoute
                  element={Movies}
                  isLoggedIn={isLoggedIn}
                />
              }
            />
            <Route
              path="/saved-movies"
              element={
                <ProtectedRoute
                  element={SavedMovies}
                  isLoggedIn={isLoggedIn}
                />
              }
            />
            <Route
              path="/sign-in"
              element={
                <Login
                  handleLogin={handleLogin}
                  isLoggedIn={isLoggedIn}
                />
              }
            />
            <Route path="/sign-up" element={
              <Register
                isLoggedIn={isLoggedIn}
                handleRegister={handleRegister}
              />}
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute
                  element={Profile}
                  isLoggedIn={isLoggedIn}
                  handleSignOut={handleSignOut}
                />
              }
            />
            <Route
              path="*"
              element={<NotFoundPage />}
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;

