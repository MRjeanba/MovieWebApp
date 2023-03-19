import styles from './MovieItem.module.css';

const MovieItem = (props) => {

    const review = parseFloat(props.review).toFixed(1);

    // We need to bring up the movie data, but also set the state of display movie to true
    const bringUpMovieData = () => {
        const movie = {
            title: props.title,
            img: props.img,
            overview: props.overview,
            review: props.review,
        };
        props.displayMovie(movie);
    };


    return (
        <li className={styles.movieItem} key={props.id} onClick={bringUpMovieData}>
            <h2>{props.title}</h2>
            <img src={props.img} className={styles.img} alt="Oops... you should see an image of the movie. Sorry!" />
            <p>Users review: {review}/10</p>
        </li>
    )
};

export default MovieItem;