import React, { useCallback, useEffect, useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { CurrentUserContext } from '../../contexts/CurrentUserContext';

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
import mainApi from '../../utils/MainApi';
import { beatFilmApi } from '../../utils/MoviesApi';

import { SEARCH_MESSAGE } from '../../utils/constants/mainConstants';
import { RES_MESSAGE } from '../../utils/constants/mainConstants';
import { SHORT_MOVIE_MAX_DURATION_MINUTES } from '../../utils/constants/mainConstants';

function App() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isError, setIsError] = useState(false);
  const [message, setIsMessage] = useState('');
  const [currentUser, setCurrentUser] = useState({});
  const [movies, setMovies] = useState([]);
  const [savedMovies, setSavedMovies] = useState([]);

  const handleApiError = useCallback((err) => {
    setIsError(true);
    setIsMessage(RES_MESSAGE.MESSAGE_ERROR);
    console.log(err);
  }, []);

  const checkToken = useCallback(async () => {
    try {
      const token = localStorage.getItem("jwt");
      const res = await mainApi.checkToken(token);
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
      navigate("/movies");
    }
    catch (err) {
      console.log(err);
      setIsError(true);
      setIsMessage(RES_MESSAGE.MESSAGE_BAD_REQUEST);
    }
    finally {
      setIsFetching(false);
    }
  }, [checkToken, navigate]);

  const handleRegister = useCallback(async (name, email, password) => {
    try {
      setIsFetching(true);
      await mainApi.signUp(name, email, password);
      await handleLogin(email, password);
    }
    catch (err) {
      console.log(err);
      setIsError(true);
      setIsMessage(RES_MESSAGE.MESSAGE_BAD_REQUEST);
    }
    finally {
      setIsFetching(false);
    }
  }, [handleLogin]);

  // movies
  const moviesSearchFilter = useCallback((movie, keyword) => {
    const searchShortMovies = localStorage.getItem("movie-search-short-movies") === String(true);
    if (searchShortMovies && movie.duration > SHORT_MOVIE_MAX_DURATION_MINUTES) {
      return false;
    }

    const searchFields = [movie.nameRU, movie.nameEN, movie.description, movie.director];
    return searchFields.some((f) => f.toLowerCase().includes(keyword));
  }, []);

  const findMovies = useCallback(async () => {
    try {
      const keyword = localStorage.getItem("movie-search-last-keyword").toLowerCase();
      if (keyword === "") {
        return;
      }

      setIsFetching(true);
      await beatFilmApi.getMovies().then(res => {
        const foundMovies = res.filter((movie) => moviesSearchFilter(movie, keyword));
        setMovies(foundMovies);
        if (!foundMovies.length) {
          setIsError(true);
          setIsMessage(SEARCH_MESSAGE.MESSAGE_NOT_FOUND);
        } else {
          setIsError(false);
          setIsMessage('');
        }
      });
    }
    catch (err) {
      handleApiError(err);
      console.log(err);
      setIsError(true);
      setIsMessage(SEARCH_MESSAGE.MESSAGE_SEARCH_ERROR);
    }
    finally {
      setIsFetching(false);
    }
  }, [handleApiError, moviesSearchFilter]);

  const handleSubmitSearch = useCallback((keyword) => {
    localStorage.setItem("movie-search-last-keyword", keyword);
    findMovies();
  }, [findMovies]);

  const handleShortFilmsCheckbox = useCallback(() => {
    const searchShortMovies = localStorage.getItem("movie-search-short-movies") === String(true);
    localStorage.setItem("movie-search-short-movies", String(!searchShortMovies));
    findMovies();
  }, [findMovies]);

  const handleMovieLikeClick = useCallback(async (movieData) => {
    try {
      const savedMoviesRes = await mainApi.getSavedMovies();
      if (savedMoviesRes.data.some((m) => (m.nameRU === movieData.nameRU))) {
        const savedMovieData = savedMoviesRes.data.find((m) => (m.nameRU === movieData.nameRU));
        await mainApi.deleteMovie(savedMovieData._id);
      } else {
        await mainApi.saveMovie(movieData);
      }
      const savedMoviesUpdRes = await mainApi.getSavedMovies();
      setSavedMovies(savedMoviesUpdRes.data);
    }
    catch (err) {
      handleApiError(err);
      console.log(err);
    }
  }, [handleApiError]);

  const handleMovieDeleteClick = useCallback(async (movieData) => {
    try {
      await mainApi.deleteMovie(movieData._id);
      const savedMoviesUpdRes = await mainApi.getSavedMovies();
      setSavedMovies(savedMoviesUpdRes.data);
    }
    catch (err) {
      console.log(err);
    }
  }, []);

  const findSavedMovies = useCallback(async () => {
    try {
      setIsFetching(true);
      const keyword = localStorage.getItem("movie-search-last-keyword").toLowerCase();
      if (keyword === "") {
        return;
      }

      const res = await mainApi.getSavedMovies();
      const foundMovies = res.data.filter((movie) => moviesSearchFilter(movie, keyword));
      setSavedMovies(foundMovies);
      if (!foundMovies.length) {
        setIsError(true);
        setIsMessage(SEARCH_MESSAGE.MESSAGE_NOT_FOUND);
      } else {
        setIsError(false);
        setIsMessage('');
      }
    }
    catch (err) {
      handleApiError(err);
      console.log(err);
    }
    finally {
      setIsFetching(false);
    }
  }, [handleApiError, moviesSearchFilter]);

  const handleSavedMoviesSearch = useCallback((keyword) => {
    localStorage.setItem("movie-search-last-keyword", keyword);
    findSavedMovies();
  }, [findSavedMovies]);

  const handleSavedShortFilmsCheckbox = useCallback(() => {
    const searchShortMovies = localStorage.getItem("movie-search-short-movies") === String(true);
    localStorage.setItem("movie-search-short-movies", String(!searchShortMovies));
    findSavedMovies();
  }, [findSavedMovies]);

  useEffect(() => {
    if (pathname.startsWith('/movies')) {
      findMovies();
    } else if (pathname.startsWith('/saved-movies')) {
      findSavedMovies();
    }
  }, [findMovies, findSavedMovies, pathname]);


  const handleSignOut = useCallback(() => {
    setIsLoggedIn(false);
    setCurrentUser({});
    setMovies([]);
    localStorage.clear();
  }, []);

  const handleEditProfile = useCallback(async (email, name) => {
    try {
      setIsFetching(true);
      const res = await mainApi.setUserInfo({
        email: email,
        name: name,
      })
      console.log(res);
    }
    catch (err) {
      console.log(err);
      setIsError(true);
      setIsMessage(RES_MESSAGE.MESSAGE_UPDATE_ERROR);
    }
    finally {
      setIsFetching(false);
    }
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
                  handleSubmitSearch={handleSubmitSearch}
                  handleShortFilmsCheckbox={handleShortFilmsCheckbox}
                  handleMovieLikeClick={handleMovieLikeClick}
                  movies={movies}
                  findMovies={findMovies}
                  savedMovies={savedMovies}
                  isFetching={isFetching}
                  isError={isError}
                  message={message}
                />
              }
            />
            <Route
              path="/saved-movies"
              element={
                <ProtectedRoute
                  element={SavedMovies}
                  isLoggedIn={isLoggedIn}
                  savedMovies={savedMovies}
                  handleSavedMoviesSearch={handleSavedMoviesSearch}
                  handleSavedShortFilmsCheckbox={handleSavedShortFilmsCheckbox}
                  handleMovieDeleteClick={handleMovieDeleteClick}
                  findSavedMovies={findSavedMovies}
                  isFetching={isFetching}
                  isError={isError}
                  message={message}
                />
              }
            />
            <Route
              path="/sign-in"
              element={
                <Login
                  handleLogin={handleLogin}
                  isLoggedIn={isLoggedIn}
                  isError={isError}
                  isFetching={isFetching}
                  message={message}
                />
              }
            />
            <Route path="/sign-up" element={
              <Register
                isLoggedIn={isLoggedIn}
                handleRegister={handleRegister}
                isError={isError}
                isFetching={isFetching}
                message={message}
              />}
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute
                  element={Profile}
                  isLoggedIn={isLoggedIn}
                  handleSignOut={handleSignOut}
                  handleEditProfile={handleEditProfile}
                  isFetching={isFetching}
                  isError={isError}
                  message={message}
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

