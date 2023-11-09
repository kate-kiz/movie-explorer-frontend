import React, { useState, useEffect } from 'react';
import MoviesCard from '../MoviesCard/MoviesCard';
import './MoviesCardList.css';
import { useLocation } from 'react-router-dom';
import Preloader from '../Preloader/Preloader';

function MoviesCardList({ moviesData, handleMovieLikeClick, handleMovieDeleteClick, isFetching }) {
  const [visibleMoviesCount, setVisibleMoviesCount] = useState(12);
  const totalMoviesCount = moviesData.length;

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

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleLoadMore = () => {
    setVisibleMoviesCount(visibleMoviesCount + 4);
  };

  if (isFetching) return <Preloader />

  return (
    <section className='movies-cards'>
      <ul className="movies-card-list">
        {moviesData.slice(0, visibleMoviesCount).map((movie) => (
          <MoviesCard
            key={movie.id ?? movie.movieId}
            movieData={movie}
            handleMovieLikeClick={handleMovieLikeClick}
            handleMovieDeleteClick={handleMovieDeleteClick}
            isLiked={movie.isLiked}
          />
        )
        )}
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
