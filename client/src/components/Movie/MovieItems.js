//This component will be responsible to give the data 
//to the Movie Item component that will display each movies
//This component will be called from a card
import MovieItem from './MovieItem';
import styles from './MovieItems.module.css';


const MovieItems = (props) => {

    const noMoviesMessage = <p className={styles.noMovies}>You have no movies yet, hit the add movie button !</p>;
    const moviesAvailable = <div>
        <ul className={styles.items}>
            {props.moviesStored.length > 0 && props.moviesStored.map((movie) => { return (<MovieItem title={movie.title} overview={movie.overview} review={movie.review} release={movie.release} img={movie.poster} key={movie.id}/>) })}
        </ul>
    </div>;

    return (
        props.moviesStored.length === 0 ? noMoviesMessage : moviesAvailable
    )
};

export default MovieItems;

