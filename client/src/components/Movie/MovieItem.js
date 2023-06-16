import styles from './MovieItem.module.css';

const MovieItem = (props) => {
    const review = parseFloat(props.movie.review).toFixed(1);

    console.log('from movieItem component'+props.movie);

    // We need to bring up the movie data
    const bringUpMovieData = () => {
        const movie = {
            title: props.movie.title,
            img: props.movie.poster,
            overview: props.movie.overview,
            review: props.movie.review,
            id: props.movie._id,
            localReviews: props.movie.localReviews
        };
        props.displayMovie(movie);
    };


    return (
        <li className={styles.movieItem} key={props.movie.id} onClick={bringUpMovieData}>
            <h2>{props.movie.title}</h2>
            <img src={props.movie.poster} className={styles.img} alt="Oops... you should see an image of the movie. Sorry!" />
            <p> <span className={"fa fa-star " + styles.checked} style={{ fontSize: '28px' }}></span>
                 {" "+ review}/10
            </p>
        </li>
    )
};

export default MovieItem;