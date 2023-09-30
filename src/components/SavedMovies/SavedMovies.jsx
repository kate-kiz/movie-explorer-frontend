import SearchForm from "../SearchForm/SearchForm";
import MoviesCardList from "../MoviesCardList/MoviesCardList";
import './SavedMovies.css';

function SavedMovies({
	savedMovies,
	handleSavedMoviesSearch,
	handleSavedShortFilmsCheckbox,
	handleMovieDeleteClick,
	isFetching,
	isError,
	message,
}) {

	return (
		<>
			<SearchForm
				handleSubmitSearch={handleSavedMoviesSearch}
				handleShortFilmsCheckbox={handleSavedShortFilmsCheckbox}
				isError={isError}
				message={message}
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