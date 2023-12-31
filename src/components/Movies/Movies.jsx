import React from "react";
import SearchForm from "../SearchForm/SearchForm";
import MoviesCardList from "../MoviesCardList/MoviesCardList";

import './Movies.css';


function Movies({ movies, localStorageItemName, movieFormCheckbox, handleMovieLikeClick, handleShortFilmsCheckbox, handleSubmitSearch, isFetching, isError, message }) {
	return (
		<>
			<SearchForm
				handleSubmitSearch={handleSubmitSearch}
				handleShortFilmsCheckbox={handleShortFilmsCheckbox}
				isError={isError}
				message={message}
				movieFormCheckbox={movieFormCheckbox}
				localStorageItemName={localStorageItemName}
			/>
			<MoviesCardList
				handleMovieLikeClick={handleMovieLikeClick}
				moviesData={movies}
				// savedMovies={savedMovies}
				isFetching={isFetching}
			/>
		</>
	)
}

export default Movies;