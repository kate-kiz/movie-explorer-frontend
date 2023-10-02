
import './MoviesCard.css';
import { Link } from 'react-router-dom';
import { BASE_URL_IMAGES } from '../../utils/constants/mainConstants';
import { useLocation } from 'react-router-dom';

function MoviesCard({
  movieId,
  movieData,
  isLiked,
  handleMovieLikeClick,
  handleMovieDeleteClick,
}) {
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
  };


  return (
    <li className="movie-card" key={movieId}>
      <Link to={trailerLink} target='_blank' className="movie-card__trailer-link">
        <img className="movie-card__image" src={image} alt={nameRU} />
      </Link>
      <div className='movie-card__container'>
        <div className='movie-card__info'>
          <h2 className="movie-card__title">{nameRU}</h2>
          <p className="movie-card__duration">{`${Math.floor(duration / 60)}ч ${duration % 60}м`}</p>
        </div>
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
