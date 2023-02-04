//This component will be responsible to give the data 
//to the Movie Item component that will display each movies
//This component will be called from a card
import MovieItem from './MovieItem';
import styles from './MovieItems.module.css';

const DUMMY_MOVIES = [
    {
        name: 'Lord of the Rings',
        review: 5,
        duration: '2h30'
    },
    {
        name: 'Harry Poter 1',
        review: 5,
        duration: '2h00'
    },
    {
        name: 'E.T ',
        review: 5,
        duration: '2h00'
    }
];


const MovieItems = (props) => {

    return (
        <div className={styles.items}>
            {DUMMY_MOVIES.map((movie) => { return <li><MovieItem title={movie.name} review={movie.review} /> </li>})}
        </div>
    )
};

export default MovieItems;

