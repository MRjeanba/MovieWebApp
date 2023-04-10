//This component will be responsible to give the data 
//to the Movie Item component that will display each movies
//This component will be called from a card
import { useContext } from 'react';
import MovieItem from './MovieItem';
import styles from './MovieItems.module.css';
import MoviesContext from '../../Contexts/MoviesContext';


const MovieItems = (props) => {
    const ctx = useContext(MoviesContext);
    console.log(ctx.movies[0]);
    
    const noMoviesMessage = <p className={styles.noMovies}>You have no movies yet, hit the add movie button !</p>;
    const moviesAvailable = <div>
        <ul className={styles.items}>
            {ctx.movies.length > 0 && ctx.movies.map((movie) => { return (<MovieItem displayMovie={props.displayMovie} movie={movie} key={movie.id}/>) })}
        </ul>
    </div>;

    return (
        ctx.movies.length === 0 ? noMoviesMessage : moviesAvailable
    )
};

export default MovieItems;

