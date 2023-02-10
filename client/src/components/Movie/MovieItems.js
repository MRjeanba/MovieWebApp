//This component will be responsible to give the data 
//to the Movie Item component that will display each movies
//This component will be called from a card
import MovieItem from './MovieItem';
import styles from './MovieItems.module.css';



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
        }
    ];
    return (
        <ul className={styles.items}>
            {DUMMY_MOVIES.map((movie) => { return (<MovieItem title={movie.name} review={movie.review} duration={movie.duration}/> )})}
        </ul>
    )
};

export default MovieItems;

