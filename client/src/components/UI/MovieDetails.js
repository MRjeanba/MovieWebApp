import BackDrop from '../UX/BackDrop';
import classes from './MovieDetails.module.css';

const MovieDetails = (props) => {

    // to make disappears the backdrop and the modal on click
    const hideDetails = () => {
        props.displayMovieData(null);
    };


    return (

        <>
            <BackDrop backdropHandler={hideDetails}/>
            <div className={classes.modal}>
                <h3>YOOOO</h3>
            </div>
        </>


    )
}; export default MovieDetails;