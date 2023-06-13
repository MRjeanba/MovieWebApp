import { useState } from 'react';
import BackDrop from '../UX/BackDrop';
import KebabMenuIcon from '../UX/KebabMenuIcon';
import classes from './MovieDetails.module.css';
import AddReviewModal from './AddReviewModal';
const MovieDetails = (props) => {

    const [isAddReviewShown, setIsAddReviewShown] = useState(false);

    // To make it easier to type, we extract all the properties of the object in props to a variable here
    const movieObject = {...props.details};
    // to make disappears the backdrop and the modal on click
    const hideDetails = () => {
        props.displayMovieData(null);
    };

    function showAddReviewModal(){
        setIsAddReviewShown(true);
    }
    function hideAddReviewModal(){
        setIsAddReviewShown(false);
    }


    // Transform movie link for img since in this modal we can make the movie image larger
    let imgUrl = props.details.img;
    imgUrl = imgUrl.replace('w400','w500');

    return (
        <>
            <BackDrop backdropHandler={hideDetails} />
            <div className={classes.modal}>
                <div className={classes.container1}>
                    <button onClick={showAddReviewModal}>Add review</button>
                    <img className={classes.imgDetails} src={imgUrl} />
                    <span className={"fa fa-star " + classes.checked} style={{fontSize: '28px'}}></span>
                    <p className={classes.rating}>{movieObject.review}</p>
                    <p>{movieObject.localReviews}</p>
                </div>
                <div className={classes.container2}>
                    <KebabMenuIcon items={["Delete","Update"]} movieId={movieObject.id} hideMovieDetails={hideDetails}/>
                    <h1 className={classes.title}>{movieObject.title}</h1>
                    <p className={classes.overview}>{movieObject.overview}</p>
                </div>
                {isAddReviewShown && <AddReviewModal hideModal={hideAddReviewModal} title="Add a review to this movie!" />}
            </div>
            
        </>
    )
}; export default MovieDetails;