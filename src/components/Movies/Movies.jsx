import React, { useState, useCallback, useEffect } from "react";
import SearchForm from "../SearchForm/SearchForm";
import MoviesCardList from "../MoviesCardList/MoviesCardList";

import './Movies.css';
import { beatFilmApi } from "../../utils/MoviesApi";

const SHORT_MOVIE_MAX_DURATION_MINUTES = 40;


function Movies() {
	const [movies, setMovies] = useState([]);

	const moviesSearchFilter = useCallback((movie, keyword) => {
		const searchShortMovies = localStorage.getItem("movie-search-short-movies") === String(true);
		if (searchShortMovies && movie.duration > SHORT_MOVIE_MAX_DURATION_MINUTES) {
			return false;
		}

		const searchFields = [movie.nameRU, movie.nameEN, movie.description, movie.director];
		return searchFields.some((f) => f.toLowerCase().includes(keyword));
	}, []);

	const findMovies = useCallback(() => {
		const keyword = localStorage.getItem("movie-search-last-keyword").toLowerCase();

		beatFilmApi.getMovies().then(res => {
			const foundMovies = res.filter((movie) => moviesSearchFilter(movie, keyword));
			setMovies(foundMovies);
		});
	}, [moviesSearchFilter]);

	const handleSubmitSearch = useCallback((keyword) => {
		localStorage.setItem("movie-search-last-keyword", keyword);
		findMovies();
	}, [findMovies]);

	const handleShortFilmsCheckbox = useCallback(() => {
		const searchShortMovies = localStorage.getItem("movie-search-short-movies") === String(true);
		localStorage.setItem("movie-search-short-movies", String(!searchShortMovies));
		findMovies();
	}, [findMovies]);

	useEffect(() => {
		findMovies()
	}, [findMovies]);

	return (
		<>
			<SearchForm
				handleSubmitSearch={handleSubmitSearch}
				handleShortFilmsCheckbox={handleShortFilmsCheckbox}
			/>
			<MoviesCardList moviesData={movies} />
		</>
	)
}

export default Movies;