import styles from './MovieItem.module.css';

/**
 * 
 * @param { object } movie the current movie item object
 * @returns the average review of the current movie (given by the users of the webapp)
 */
export const getAverageReview = (movie) => {
    let avg = 0

    if (movie.localReviews.length === undefined || movie.localReviews.length === 0) {
        return -1
    }

    movie.localReviews.forEach(review => {
        avg += review
    });
    avg = avg / movie.localReviews.length

    return parseFloat(avg).toFixed(1);
}

const MovieItem = (props) => {


    let review = getAverageReview(props.movie);

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
            {review > 0 ? <p> <span className={"fa fa-star " + styles.checked} style={{ fontSize: '28px' }}></span>
                {" " + review}/10
            </p> : <p>No reviews yet...</p>}
        </li>
    )
};
export default MovieItem;
