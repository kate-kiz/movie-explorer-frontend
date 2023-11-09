import SearchForm from "../SearchForm/SearchForm";
import MoviesCardList from "../MoviesCardList/MoviesCardList";
import './SavedMovies.css';

function SavedMovies({
	handleSavedMoviesSearch,
	handleSavedShortFilmsCheckbox,
	handleMovieDeleteClick,
	isFetching,
	isError,
	message,
	movies,
	movieFormCheckbox,
	localStorageItemName,
}) {

	return (
		<>
			<SearchForm
				handleSubmitSearch={handleSavedMoviesSearch}
				handleShortFilmsCheckbox={handleSavedShortFilmsCheckbox}
				isError={isError}
				message={message}
				movieFormCheckbox={movieFormCheckbox}
				localStorageItemName={localStorageItemName}
			/>
			<MoviesCardList
				moviesData={movies}
				// savedMovies={savedMovies}
				location="saved-movies"
				handleMovieDeleteClick={handleMovieDeleteClick}
				handleMovieLikeClick={() => { }}
				isFetching={isFetching}
			/>
		</>
	)
}

export default SavedMovies;