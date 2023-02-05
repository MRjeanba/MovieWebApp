//This will receive as props an array of movies and then display an item for each movie
import styles from './MovieItem.module.css';

const MovieItem = (props) => {

    return (
        <div className={styles.movieItem}>
            <h3>{props.title}</h3>
            <p>{props.review}</p>
        </div>
    )
};

export default MovieItem;