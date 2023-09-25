import React, { useState, useEffect } from 'react';
import MoviesCard from '../MoviesCard/MoviesCard';
import './MoviesCardList.css';
import { useLocation } from 'react-router-dom';
import Preloader from '../Preloader/Preloader';

function MoviesCardList({ moviesData, handleMovieLikeClick, handleMovieDeleteClick, savedMovies, isFetching, isError }) {
  const [visibleMoviesCount, setVisibleMoviesCount] = useState(12);
  const [movieCards, setMovieCards] = useState([]);
  const totalMoviesCount = moviesData.length;

  const { pathname } = useLocation();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 679) {
        setVisibleMoviesCount(5);
      }
      else if (window.innerWidth < 769) {
        setVisibleMoviesCount(8);
      } else {
        setVisibleMoviesCount(16);
      }
    };

    handleResize(); // Установка видимого количества карточек при первом рендере

    window.addEventListener('resize', handleResize); // Добавление обработчика изменения размера окна

    return () => {
      window.removeEventListener('resize', handleResize); // Удаление обработчика при размонтировании компонента
    };
  }, []);

  useEffect(() => {
    const cards = moviesData.slice(0, visibleMoviesCount).map((movie, index) => {
      let isLiked = true;
      if (pathname.startsWith('/movies')) {
        isLiked = savedMovies.some(savedMovie => savedMovie.movieId === movie.id)
      } return (
        <MoviesCard
          key={index}
          movieData={movie}
          handleMovieLikeClick={handleMovieLikeClick}
          handleMovieDeleteClick={handleMovieDeleteClick}
          savedMovies={savedMovies}
          isLiked={isLiked}
        />
      );
    });

    setMovieCards(cards);

  }, [savedMovies, moviesData, visibleMoviesCount, handleMovieLikeClick, handleMovieDeleteClick, pathname]);

  const handleLoadMore = () => {
    setVisibleMoviesCount(visibleMoviesCount + 4);
  };

  if (isFetching) return <Preloader />

  return (
    <section className='movies-cards'>
      <ul className="movies-card-list">
        {movieCards}
      </ul>
      <div className='movies-cards__load-more-block'>
        {visibleMoviesCount < totalMoviesCount && (
          <button className="button-hover movies-cards__button" onClick={handleLoadMore}>
            Ещё
          </button>
        )}
      </div>
    </section>
  );
}

export default MoviesCardList;
