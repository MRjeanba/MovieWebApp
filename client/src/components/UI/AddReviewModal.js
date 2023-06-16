import classes from './AddReviewModal.module.css';
import BackDrop from '../UX/BackDrop';
import { useReducer, useRef } from 'react';

const AddReviewModal = (props) => {

    // The call to the api should be made from there : post api/AddReview
    // We push in the localReviews field from the current movie object the entered value
    // we also do it in the front end side to give a instant feedback to the user 
    const reviewRef = useRef();

    async function postReviewScore(reviewEntered, movieId) {

        const obj = { review: reviewEntered, movieId: movieId }

        const response = await fetch('api/AddReview',
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                body: obj
            });
        
    }

    /**
     * Add the users review to the buisness model object used in the FE
     * @returns nothing
     */
    function addUserReview(){
        const reviewEntered = reviewRef.current.value;

        if(reviewEntered == null || reviewEntered < 0 || reviewEntered > 10 || reviewEntered.length === 0){
            alert("Please, provide a correct number between 0 and 10");
            return;
        }
        props.currentMovie.localReviews.push(parseInt(reviewRef.current.value));
        props.hideModal();
    };

    return(
            <>
                <BackDrop backdropHandler = {props.hideModal} />
                <div className={classes.modal}>
                    <h2 className={classes.title}>{props.title}</h2>
                    <input ref={reviewRef} className={classes.reviewInput} type="number" min={0} max={10} placeholder="Your rating out of 10"></input>
                    <button className={classes.modalButton} onClick={addUserReview}>Submit</button>
                    <button className={classes.modalButton} onClick={props.hideModal}>Cancel</button>
                </div>
            </>
    );
};

export default AddReviewModal;