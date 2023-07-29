//This component will be responsible to give the data 
//to the Movie Item component that will display each movies
//This component will be called from a card
import { useContext } from 'react';
import MovieItem from './MovieItem';
import styles from './MovieItems.module.css';
import MoviesContext from '../../Contexts/MoviesContext';


const MovieItems = (props) => {
    const ctx = useContext(MoviesContext);
    console.log(props.filteredMovies);
    
    const noMoviesMessage = <p className={styles.noMovies}>You have no movies yet, hit the add movie button !</p>;
    const moviesAvailable = <div>
        <ul className={styles.items}>
            {ctx.movies.length > 0 && ctx.movies.map((movie) => { return (<MovieItem displayMovie={props.displayMovie} movie={movie} key={movie.id}/>) })}
        </ul>
    </div>;

    const moviesFiltered = <div>
        <ul className={styles.items}>
            {props.filteredMovies.length > 0 && props.filteredMovies.map((movie) => { return (<MovieItem displayMovie={props.displayMovie} movie={movie} key={movie.id} />) })}
        </ul>
    </div>;


    return (
        props.filteredMovies.length < 1 ? (ctx.movies.length === 0 ? noMoviesMessage : moviesAvailable) : moviesFiltered
    )
};

export default MovieItems;

