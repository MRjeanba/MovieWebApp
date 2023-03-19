import BackDrop from '../UX/BackDrop';
import classes from './MovieDetails.module.css';

const MovieDetails = (props) => {

    // to make disappears the backdrop and the modal on click
    const hideDetails = () => {
        props.displayMovieData(null);
    };
    
    // Transform movie link for img since in this modal we can make the movie image larger
    let imgUrl = props.details.img;
    imgUrl = imgUrl.replace('w400','w500');

    //TODO: Use the movie details inside the props.details to display movie information!!
    return (
        <>
            <BackDrop backdropHandler={hideDetails} />
            <div className={classes.modal}>
                <div className={classes.container1}>
                    <img className={classes.imgDetails} src={props.details.img} />
                </div>
                <div className={classes.container2}>
                    <h3>YOOOO</h3>
                </div>
            </div>
        </>
    )
}; export default MovieDetails;