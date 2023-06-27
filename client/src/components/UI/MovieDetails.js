import { useState } from 'react';
import BackDrop from '../UX/BackDrop';
import KebabMenuIcon from '../UX/KebabMenuIcon';
import classes from './MovieDetails.module.css';
import AddReviewModal from './AddReviewModal';
import { getAverageReview } from '../Movie/MovieItem';

const MovieDetails = (props) => {

    const [isAddReviewShown, setIsAddReviewShown] = useState(false);

    // To make it easier to type, we extract all the properties of the object in props to a variable here
    const movieObject = {...props.details};

    const review = getAverageReview(movieObject)

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
                    <img className={classes.imgDetails} src={imgUrl} alt='Sorry, you should see the movie image here'/>
                    {review > 0  && <span className={"fa fa-star " + classes.checked} style={{fontSize: '28px'}}></span>}
                    {review > 0 ? <p className={classes.rating}>{review}</p> : <p className={classes.rating} style={{marginTop:'2%'}}>No reviews yet...</p>}
                    <button className={classes.addReview} onClick={showAddReviewModal}>Add review</button>
                </div>
                <div className={classes.container2}>
                    <KebabMenuIcon items={["Delete","Update"]} movieId={movieObject.id} hideMovieDetails={hideDetails}/>
                    <h1 className={classes.title}>{movieObject.title}</h1>
                    <p className={classes.overview}>{movieObject.overview}</p>
                </div>
                {isAddReviewShown && <AddReviewModal currentMovie={movieObject} hideModal={hideAddReviewModal} title="Add a review to this movie!" />}
            </div>
            
        </>
    )
}; export default MovieDetails;