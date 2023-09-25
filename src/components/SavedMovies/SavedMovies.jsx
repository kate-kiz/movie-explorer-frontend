import SearchForm from "../SearchForm/SearchForm";
import MoviesCardList from "../MoviesCardList/MoviesCardList";
import './SavedMovies.css';

function SavedMovies({
	findSavedMovies,
	savedMovies,
	handleSavedMoviesSearch,
	handleSavedShortFilmsCheckbox,
	handleMovieDeleteClick,
	isFetching,
}) {

	return (
		<>
			<SearchForm
				handleSubmitSearch={handleSavedMoviesSearch}
				handleShortFilmsCheckbox={handleSavedShortFilmsCheckbox}
			/>
			<MoviesCardList
				moviesData={savedMovies}
				location="saved-movies"
				handleMovieDeleteClick={handleMovieDeleteClick}
				handleMovieLikeClick={() => { }}
				isFetching={isFetching}
			/>
		</>
	)
}

export default SavedMovies;