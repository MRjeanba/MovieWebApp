//This will receive as props an array of movies and then display an item for each movie
import styles from './MovieItem.module.css';

const MovieItem = (props) => {

    return (
        <li className={styles.movieItem} key={props.id}>
            <h2>{props.title}</h2>
            {/* <h3>{props.overview}</h3> */}
            <img src={props.img} className={styles.img} alt="Oops... you should see an image from the movie. Sorry!"/>
            <p>Users review : {props.review} / 10</p>
        </li>
    )
};

export default MovieItem;