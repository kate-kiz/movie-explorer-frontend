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
import Preloader from "../Preloader/Preloader";

import './App.css';

import mainApi from '../../utils/MainApi';
import { beatFilmApi } from '../../utils/MoviesApi';

import { SEARCH_MESSAGE, QUERY_KEYS, RES_MESSAGE, SHORT_MOVIE_MAX_DURATION_MINUTES } from '../../utils/constants/mainConstants';


function App() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setIsMessage] = useState('');
  const [currentUser, setCurrentUser] = useState({});

  const [fetchedMovies, setFetchedMovies] = useState([]);
  const [savedMovies, setSavedMovies] = useState([]);
  const [movies, setMovies] = useState([]);

  const [movieFormCheckbox, setMovieFormCheckbox] = useState(localStorage.getItem(QUERY_KEYS.MOVIES_SEARCH_CHECKBOX_KEY) === String(true));
  const [savedMovieFormCheckbox, setSavedMovieFormCheckbox] = useState(localStorage.getItem(QUERY_KEYS.SAVED_MOVIES_SEARCH_CHECKBOX_KEY) === String(true));

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

  const handleSignOut = useCallback(() => {
    setIsLoggedIn(false);
    setCurrentUser({});
    setFetchedMovies([]);
    localStorage.clear();
  }, []);

  const handleEditProfile = useCallback(async (email, name) => {
    try {
      setIsFetching(true);
      const res = await mainApi.setUserInfo({
        email: email,
        name: name,
      });
      setCurrentUser(res.data);
      console.log(res);
      setIsError(true);
      setIsMessage(RES_MESSAGE.MESSAGE_UPDATE_SUCCESS);
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

  const moviesSearchFilter = useCallback((movie, keyword) => {
    let searchShortMovies = false;
    switch (pathname) {
      case '/movies':
        searchShortMovies = localStorage.getItem(QUERY_KEYS.MOVIES_SEARCH_CHECKBOX_KEY) === String(true);
        break;
      case '/saved-movies':
        searchShortMovies = localStorage.getItem(QUERY_KEYS.SAVED_MOVIES_SEARCH_CHECKBOX_KEY) === String(true);
        break;
      default:
        searchShortMovies = false;
        break;
    }

    if (searchShortMovies && movie.duration > SHORT_MOVIE_MAX_DURATION_MINUTES) {
      return false;
    };

    const searchFields = [movie.nameRU, movie.nameEN, movie.description, movie.director];
    return searchFields.some((f) => f.toLowerCase().includes(keyword));
  }, [pathname]);

  const fetchMovies = useCallback(async () => {
    try {
      setIsFetching(true);
      await beatFilmApi.getMovies().then(res => {
        setFetchedMovies(res);
        setIsError(false);
        setIsMessage('');
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
  }, []);

  const findMovies = useCallback(() => {
    const keyword = localStorage.getItem(QUERY_KEYS.MOVIES_SEARCH_QUERY_KEY).toLowerCase();

    const _filteredMovies = fetchedMovies.filter((m) => moviesSearchFilter(m, keyword));
    if (_filteredMovies.length === 0) {
      setIsError(true);
      setIsMessage(SEARCH_MESSAGE.MESSAGE_NOT_FOUND);
    } else {
      setIsError(false);
      setIsMessage('');
    }
    const adjustedMovies = _filteredMovies.map(movie => (
      { ...movie, isLiked: savedMovies.some((m) => (m.nameRU === movie.nameRU)) }
    )) || [];
    setMovies(adjustedMovies);
  }, [moviesSearchFilter, fetchedMovies, savedMovies]);

  const findSavedMovies = useCallback(() => {
    const keyword = localStorage.getItem(QUERY_KEYS.SAVED_MOVIES_SEARCH_QUERY_KEY).toLowerCase();

    const _filteredMovies = savedMovies.filter((m) => moviesSearchFilter(m, keyword));
    if (_filteredMovies.length === 0) {
      setIsError(true);
      setIsMessage(SEARCH_MESSAGE.MESSAGE_NOTHING_SAVED);
    } else {
      setIsError(false);
      setIsMessage('');
    }
    const adjustedMovies = _filteredMovies.map(movie => (
      { ...movie, isLiked: savedMovies.some((m) => (m.nameRU === movie.nameRU)) }
    )) || [];
    setMovies(adjustedMovies)
  }, [moviesSearchFilter, savedMovies]);

  const handleSubmitSearch = useCallback(async (keyword) => {
    localStorage.setItem(QUERY_KEYS.MOVIES_SEARCH_QUERY_KEY, keyword);

    await fetchMovies();

    findMovies();
  }, [fetchMovies, findMovies]);

  const handleShortFilmsCheckbox = useCallback(() => {
    const searchShortMovies = localStorage.getItem(QUERY_KEYS.MOVIES_SEARCH_CHECKBOX_KEY) === String(true);
    localStorage.setItem(QUERY_KEYS.MOVIES_SEARCH_CHECKBOX_KEY, String(!searchShortMovies));
    findMovies();
  }, [findMovies]);

  const handleMovieLikeClick = useCallback(async (movieData) => {
    try {
      if (savedMovies.some((m) => (m.nameRU === movieData.nameRU))) {
        const savedMovieData = savedMovies.find((m) => (m.nameRU === movieData.nameRU));
        const deletedMovie = await mainApi.deleteMovie(savedMovieData._id);
        setSavedMovies(savedMovies.filter((m) => (m.nameRU !== deletedMovie.data.nameRU)));
      } else {
        const newMovie = await mainApi.saveMovie(movieData);
        setSavedMovies([...savedMovies, newMovie.data]);
      }
    }
    catch (err) {
      handleApiError(err);
      console.log(err);
    }
  }, [handleApiError, savedMovies]);

  const handleMovieDeleteClick = useCallback(async (movieData) => {
    try {
      const deletedMovie = await mainApi.deleteMovie(movieData._id);
      setSavedMovies(savedMovies.filter((m) => (m.nameRU !== deletedMovie.data.nameRU)));
    }
    catch (err) {
      console.log(err);
    }
  }, [savedMovies, fetchedMovies]);

  const handleSavedMoviesSearch = useCallback(async (keyword) => {
    // localStorage.setItem(localStorageItemName, keyword);
    localStorage.setItem(QUERY_KEYS.SAVED_MOVIES_SEARCH_QUERY_KEY, keyword);

    await fetchMovies();

    findSavedMovies();
  }, [fetchMovies, findSavedMovies]);

  const handleSavedShortFilmsCheckbox = useCallback(() => {
    const searchShortMovies = localStorage.getItem(QUERY_KEYS.SAVED_MOVIES_SEARCH_CHECKBOX_KEY) === String(true);
    localStorage.setItem(QUERY_KEYS.SAVED_MOVIES_SEARCH_CHECKBOX_KEY, String(!searchShortMovies));
    findSavedMovies();
  }, [findSavedMovies]);

  useEffect(() => {
    setIsError(false);
    setIsMessage('');
    setMovieFormCheckbox(localStorage.getItem(QUERY_KEYS.MOVIES_SEARCH_CHECKBOX_KEY) === String(true));

    if (pathname.startsWith('/saved-movies')) {
      localStorage.setItem(QUERY_KEYS.SAVED_MOVIES_SEARCH_QUERY_KEY, "");
      localStorage.setItem(QUERY_KEYS.SAVED_MOVIES_SEARCH_CHECKBOX_KEY, String(false));
    }
  }, [pathname]);

  useEffect(() => {
    fetchMovies();

    mainApi.getSavedMovies().then((initialSavedMovies) => {
      setSavedMovies(initialSavedMovies.data);
    });
  }, [fetchMovies]);

  useEffect(() => {
    if (pathname.startsWith('/movies')) {
      findMovies();
    } else if (pathname.startsWith('/saved-movies')) {
      findSavedMovies();
    }
  }, [findMovies, findSavedMovies, savedMovies, pathname]);

  useEffect(() => {
    const _checkToken = async () => {
      await checkToken();
      setIsLoading(false);
    };

    _checkToken();
  }, [checkToken]);

  if (isLoading) {
    return <Preloader />
  }

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
                  isFetching={isFetching}
                  isError={isError}
                  message={message}
                  localStorageItemName={QUERY_KEYS.MOVIES_SEARCH_QUERY_KEY}
                  movieFormCheckbox={movieFormCheckbox}
                />
              }
            />
            <Route
              path="/saved-movies"
              element={
                <ProtectedRoute
                  element={SavedMovies}
                  isLoggedIn={isLoggedIn}
                  movies={movies}
                  handleSavedMoviesSearch={handleSavedMoviesSearch}
                  handleSavedShortFilmsCheckbox={handleSavedShortFilmsCheckbox}
                  handleMovieDeleteClick={handleMovieDeleteClick}
                  isFetching={isFetching}
                  isError={isError}
                  localStorageItemName={QUERY_KEYS.SAVED_MOVIES_SEARCH_QUERY_KEY}
                  movieFormCheckbox={savedMovieFormCheckbox}
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
                  currentUser={currentUser}
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

