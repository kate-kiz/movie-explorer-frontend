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
  const [movieFormCheckbox, setMovieFormCheckbox] = useState(localStorage.getItem("movie-search-short-movies") === String(true));
  const [savedMovieFormCheckbox, setSavedMovieFormCheckbox] = useState(localStorage.getItem("movie-search-saved-short-movies") === String(true));
  const [localStorageItemName, setLocalStorageItemName] = useState('');
  // const [moviesToDisplay, setMoviesToDisplay] = useState([]);

  useEffect(() => {
    setMovies([]);
    setIsError(false);
    setIsMessage('');
    setMovieFormCheckbox(localStorage.getItem("movie-search-short-movies") === String(true));
    setSavedMovieFormCheckbox(localStorage.getItem("movie-search-saved-short-movies") === String(true));
    switch (pathname) {
      case '/movies':
        setLocalStorageItemName("movie-search-last-keyword");
        break;
      case '/saved-movies':
        setLocalStorageItemName("saved-movie-search-last-keyword");
        break;
      default:
        setLocalStorageItemName('');
        break;
    }
  }, [pathname]);

  useEffect(() => {
    checkToken();
    mainApi.getSavedMovies().then((initialSavedMovies) => {
      setSavedMovies(initialSavedMovies.data);
    });
  }, []);

  const handleApiError = (err) => {
    setIsError(true);
    setIsMessage(RES_MESSAGE.MESSAGE_ERROR);
    console.log(err);
  };

  const checkToken = async () => {
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
  };

  const handleLogin = async (email, password) => {
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
  };

  const handleRegister = async (name, email, password) => {
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
  };

  // movies
  const moviesSearchFilter = useCallback((movie, keyword) => {
    let searchShortMovies = false;
    switch (pathname) {
      case '/movies':
        searchShortMovies = localStorage.getItem("movie-search-short-movies") === String(true);
        break;
      case '/saved-movies':
        searchShortMovies = localStorage.getItem("movie-search-saved-short-movies") === String(true);
        break;
      default:
        searchShortMovies = false;
        break;
    }

    // if (pathname === '/movies') {
    //   searchShortMovies = localStorage.getItem("movie-search-short-movies") === String(true);
    // } else if (pathname === '/saved-movies') {
    //   searchShortMovies = localStorage.getItem("movie-search-saved-short-movies") === String(true);
    // };

    if (searchShortMovies && movie.duration > SHORT_MOVIE_MAX_DURATION_MINUTES) {
      return false;
    };

    const searchFields = [movie.nameRU, movie.nameEN, movie.description, movie.director];
    return searchFields.some((f) => f.toLowerCase().includes(keyword));
  }, [pathname]);

  // чтобы не было повторного рендера карточек (НО ЭТО НЕ РАБОТАЕТ)
  const getMoviesWithLikes = useCallback((films) => {
    return films.map((film) => ({ ...film, isLiked: savedMovies.some((m) => (m.nameRU === film.nameRU)) }))
  }, [savedMovies]);

  const findMovies = useCallback(async () => {
    try {
      const keyword = localStorage.getItem(localStorageItemName).toLowerCase();
      if (keyword === "") {
        return;
      }

      setIsFetching(true);
      const moviesPromise = movies.length > 0 ? Promise.resolve(movies) : beatFilmApi.getMovies();
      await moviesPromise.then(res => {
        const foundMovies = res.filter((movie) => moviesSearchFilter(movie, keyword));
        if (!foundMovies.length) {
          setIsError(true);
          setIsMessage(SEARCH_MESSAGE.MESSAGE_NOT_FOUND);
        } else {
          setIsError(false);
          setIsMessage('');
        }
        return getMoviesWithLikes(foundMovies);
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
  }, [getMoviesWithLikes, localStorageItemName, movies, moviesSearchFilter]);

  const handleSubmitSearch = useCallback((keyword) => {
    localStorage.setItem(localStorageItemName, keyword);
    findMovies();
  }, [findMovies, localStorageItemName]);

  const handleShortFilmsCheckbox = useCallback(() => {
    const searchShortMovies = localStorage.getItem("movie-search-short-movies") === String(true);
    localStorage.setItem("movie-search-short-movies", String(!searchShortMovies));
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
  }, [savedMovies]);

  const handleMovieDeleteClick = useCallback(async (movieData) => {
    try {
      const deletedMovie = await mainApi.deleteMovie(movieData._id);
      setSavedMovies(savedMovies.filter((m) => (m.nameRU !== deletedMovie.data.nameRU)));
      setMovies(getMoviesWithLikes(movies.filter((m) => (m.nameRU !== deletedMovie.data.nameRU))));
    }
    catch (err) {
      console.log(err);
    }
  }, [savedMovies, getMoviesWithLikes, movies]);

  const findSavedMovies = useCallback(() => {
    try {
      setIsFetching(true);
      const keyword = localStorage.getItem(localStorageItemName).toLowerCase();
      if (keyword === "") {
        return;
      }

      // const res = await mainApi.getSavedMovies();
      const foundMovies = savedMovies.filter((movie) => moviesSearchFilter(movie, keyword));
      if (!foundMovies.length) {
        setIsError(true);
        setIsMessage(SEARCH_MESSAGE.MESSAGE_NOTHING_SAVED);
      } else {
        setIsError(false);
        setIsMessage('');
      }
      return getMoviesWithLikes(foundMovies);
    }
    catch (err) {
      // handleApiError(err);
      console.log(err);
    }
    finally {
      setIsFetching(false);
    }
  }, [getMoviesWithLikes, localStorageItemName, moviesSearchFilter, savedMovies]);

  const handleSavedMoviesSearch = useCallback((keyword) => {
    localStorage.setItem(localStorageItemName, keyword);
    findSavedMovies();
  }, [findSavedMovies, localStorageItemName]);

  const handleSavedShortFilmsCheckbox = useCallback(() => {
    const searchShortMovies = localStorage.getItem("movie-search-saved-short-movies") === String(true);
    localStorage.setItem("movie-search-saved-short-movies", String(!searchShortMovies));
    findSavedMovies();
  }, [findSavedMovies]);

  useEffect(() => {
    if (pathname.startsWith('/movies')) {
      findMovies().then((foundMovies) => setMovies(foundMovies || []));
    } else if (pathname.startsWith('/saved-movies')) {
      findSavedMovies().then((foundMovies) => setMovies(foundMovies || []));
    }
  }, [findMovies, findSavedMovies, pathname]);


  const handleSignOut = () => {
    setIsLoggedIn(false);
    setCurrentUser({});
    setMovies([]);
    localStorage.clear();
  };

  const handleEditProfile = async (email, name) => {
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
  };

  // useEffect(() => {
  //   checkToken();
  // }, []);

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
                  // savedMovies={savedMovies}
                  isFetching={isFetching}
                  isError={isError}
                  message={message}
                  localStorageItemName={localStorageItemName}
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
                  // savedMovies={savedMovies}
                  handleSavedMoviesSearch={handleSavedMoviesSearch}
                  handleSavedShortFilmsCheckbox={handleSavedShortFilmsCheckbox}
                  handleMovieDeleteClick={handleMovieDeleteClick}
                  findSavedMovies={findSavedMovies}
                  isFetching={isFetching}
                  isError={isError}
                  localStorageItemName={localStorageItemName}
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

