import classes from './AddReviewModal.module.css';
import BackDrop from '../UX/BackDrop';
import { useContext, useRef, useState } from 'react';
import MoviesContext from '../../Contexts/MoviesContext';

const AddReviewModal = (props) => {
    const apiUrl = "https://frozen-beach-71970-3182c8239bba.herokuapp.com/";
    const ctx = useContext(MoviesContext);
    const reviewRef = useRef();
    
    const [errorMessage, setErrorMessage] = useState('')

    /**
     * 
     * @param {int} reviewEntered the review entered by the user for the movie
     * @param {mongoose.object.id} movieId the _id of the movie that the user wants to review
     * @returns the message from the backend whether or not the review has been added to the movie
     */
    async function postReviewScore(reviewEntered, movieId) {

        const obj = { review: reviewEntered, movieId: movieId }
        const response = await fetch(apiUrl+'api/AddReview',
            {
                method: "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(obj)
            });
        
        const serverResponse = await response.json()

        return serverResponse
    }


    /**
     * Add the users review to the buisness model object used in the FE
     */
    async function addUserReview(){
        const reviewEntered = reviewRef.current.value;

        if(reviewEntered == null || reviewEntered < 0 || reviewEntered > 10 || reviewEntered.length === 0){
            alert("Please, provide a correct number between 0 and 10");
            return;
        }
        const serverResponse = await postReviewScore(reviewEntered,props.currentMovie.id)
        let message = ""

        switch (serverResponse.status) {
            case 200:
                message = serverResponse.message
                props.currentMovie.localReviews.push(parseInt(reviewRef.current.value));
                ctx.movies.map((movie)=>{
                    if(movie._id === props.currentMovie.id){
                        movie.localReviews.push(parseInt(reviewRef.current.value));
                    }
                });
                break;
            
            case 401:
                message = serverResponse.message
                alert(message)
                localStorage.removeItem("token");
                break;
            
            case 403:
                message = serverResponse.message
                alert(message)
                localStorage.removeItem("token");
                break;
        
            case 500:
                message = serverResponse.message
                setErrorMessage(message)
                localStorage.removeItem("token");
                break;

            default:
                break;
        }
        props.hideModal();
    };

    return(
            <>
                <BackDrop backdropHandler = {props.hideModal} />
                <div className={classes.modal}>
                    <h2 className={classes.title}>{props.title}</h2>
                    <input ref={reviewRef} className={classes.reviewInput} type="number" min={0} max={10} placeholder="Your rating out of 10"></input>
                    {errorMessage && <p>{errorMessage}</p>}
                    <button className={classes.modalButton} onClick={addUserReview}>Submit</button>
                    <button className={classes.modalButton} onClick={props.hideModal}>Cancel</button>
                </div>
            </>
    );
};

export default AddReviewModal;