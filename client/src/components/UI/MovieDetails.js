import BackDrop from '../UX/BackDrop';
import KebabMenuIcon from '../UX/KebabMenuIcon';
import classes from './MovieDetails.module.css';

const MovieDetails = (props) => {

    // To make it easier to type, we extract all the properties of the object in props to a variable here
    const movieObject = {...props.details};


    // to make disappears the backdrop and the modal on click
    const hideDetails = () => {
        props.displayMovieData(null);
    };
    
    // Transform movie link for img since in this modal we can make the movie image larger
    let imgUrl = props.details.img;
    imgUrl = imgUrl.replace('w400','w500');

    return (
        <>
            <BackDrop backdropHandler={hideDetails} />
            <div className={classes.modal}>
                <div className={classes.container1}>
                    <img className={classes.imgDetails} src={imgUrl} />
                    <span className={"fa fa-star " + classes.checked} style={{fontSize: '28px'}}></span>
                    <p className={classes.rating}>{movieObject.review}</p>
                </div>
                <div className={classes.container2}>
                    <KebabMenuIcon />
                    <h1 className={classes.title}>{movieObject.title}</h1>
                    <p className={classes.overview}>{movieObject.overview}</p>
                </div>
            </div>
        </>
    )
}; export default MovieDetails;