//This component will be responsible to give the data 
//to the Movie Item component that will display each movies
//This component will be called from a card
import MovieItem from './MovieItem';
import styles from './MovieItems.module.css';
import { useState } from 'react';


const MovieItems = (props) => {

    const DUMMY_MOVIES = [
        {
            name: 'Lord of the Rings',
            review: 5,
            duration: '2h30',
            id: Math.random()*7,
        },
        {
            name: 'Harry Poter 1',
            review: 5,
            duration: '2h00',
            id: Math.random()*7,
        },
        {
            name: 'E.T ',
            review: 5,
            duration: '2h00',
            id: Math.random()*7,
            img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/E.T._figure_at_Madame_Tussauds_London.jpg/170px-E.T._figure_at_Madame_Tussauds_London.jpg'
        },{
            name: 'E.T ',
            review: 5,
            duration: '2h00',
            id: Math.random()*7,
            img: '/home/jb/Bureau/Fanny/photo_secret'
        },{
            name: 'E.T ',
            review: 5,
            duration: '2h00',
            id: Math.random()*7,
            img: '/home/jb/Bureau/Fanny/photo_secret'
        },{
            name: 'E.T ',
            review: 5,
            duration: '2h00',
            id: Math.random()*7,
            img: '/home/jb/Bureau/Fanny/photo_secret'
        }

    ];

    // State responsible to display to the user the content of its movie's library
    const [ storedMovies, setStoredMovies ] = useState([]);
    const [error, setError] = useState(false); // Responsible to show to the user if he encountered an error

    return (
        <div>
            <ul className={styles.items}>
                {DUMMY_MOVIES.length > 0 && !error && DUMMY_MOVIES.map((movie) => { return (<MovieItem title={movie.name} review={movie.review} duration={movie.duration} img={movie?.img} />) })}
                {error && <p>Something wrong happened, try to reload the page</p>}
            </ul>
        </div>
    )
};

export default MovieItems;

