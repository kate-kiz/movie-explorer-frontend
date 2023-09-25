
import './MoviesCard.css';
import { BASE_URL_IMAGES } from '../../utils/constants/mainConstants';
import { useLocation } from 'react-router-dom';

function MoviesCard({
  savedMovies,
  movieData,
  isLiked,
  handleMovieLikeClick,
  handleMovieDeleteClick,
}) {
  // const [isLiked, setIsLiked] = useState(false);
  const { nameRU, duration, trailerLink } = movieData;
  const { pathname } = useLocation();
  const image = pathname.startsWith('/movies') ? `${BASE_URL_IMAGES}${movieData.image.url}` : movieData.image;


  const handleLikeClick = () => {
    if (pathname.startsWith('/movies')) {
      handleMovieLikeClick(movieData);
    } else if (pathname.startsWith('/saved-movies')) {
      handleMovieDeleteClick(movieData);
    } else {
      console.log("cannot resolve button click handler");
    }
    // // handleMovieLikeClick(movieData, !isLiked);
    // // console.log(movieData);
    // // setIsLiked(!isLiked);
    // if (!isLiked) {
    //   // console.log("before", movieData);
    //   handleMovieLikeClick(movieData);
    //   console.log(BASE_URL_IMAGES, movieData.image.url, movieData.nameRU);
    //   // console.log("after", movieData);
    //   isLiked = true;
    // }
    // console.log(`button-hover movie-card__like ${isLiked ? 'movie-card__like_active' : ''} ${location === "saved-movies" ? 'movie-card__delete' : ""}`);
  };


  return (
    <li className="movie-card">
      {/* <img className="movie-card__image" src={`${BASE_URL_IMAGES}${movieData.image.url}`} alt={movieData.nameRU} /> */}
      <img className="movie-card__image" src={image} alt={nameRU} />
      <div className='movie-card__container'>
        <div className='movie-card__info'>
          <h2 className="movie-card__title">{nameRU}</h2>
          <p className="movie-card__duration">{`${Math.floor(duration / 60)}ч ${duration % 60}м`}</p>
        </div>
        {/* {
          pathname === '/saved-movies' && (
            <button
              type="button"
              className="buton-hover movie-card__delete"
              aria-label="Удалить"
            />
          )
        } */}
        <button
          className={`button-hover movie-card__like ${isLiked ? 'movie-card__like_active' : ''} ${pathname.startsWith('/saved-movies') ? 'movie-card__delete' : ""}`}
          type="button"
          onClick={handleLikeClick}
        ></button>
      </div>
    </li>
  );
}

export default MoviesCard;
