import React from "react";
import SearchForm from "../SearchForm/SearchForm";
import MoviesCardList from "../MoviesCardList/MoviesCardList";

import './Movies.css';


function Movies({ movies, savedMovies, handleMovieLikeClick, handleShortFilmsCheckbox, handleSubmitSearch, isFetching, isError }) {
	return (
		<>
			<SearchForm
				handleSubmitSearch={handleSubmitSearch}
				handleShortFilmsCheckbox={handleShortFilmsCheckbox}
			/>
			<MoviesCardList
				handleMovieLikeClick={handleMovieLikeClick}
				moviesData={movies}
				savedMovies={savedMovies}
				isFetching={isFetching}
				isError={isError}
			/>
		</>
	)
}

export default Movies;