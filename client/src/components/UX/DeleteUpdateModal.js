import { useState } from 'react';
import BackDrop from './BackDrop';
import classes from './DeleteUpdateModal.module.css';
import LoadinSpinner from '../UX/LoadingSpinner';

async function deleteFetchCall(movieId){

    const test = {name: 'JB'};
    const response = await fetch('api/delete',{
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
         },
        body: JSON.stringify({id: movieId}),
    });

    const callResponse = await response.json();
    return callResponse;
}


const DeleteUpdateModal = (props) => {

    let outcomesText = '';
    const [isLoading, setIsLoading] = useState(false);
    const [updateMessage, setUpdateMessage] = useState(undefined);
    const [hasError, setHasError] = useState(false);

    const onProceedHandler = async () => {
        console.log(props.movieId);
        setIsLoading(true);
        const response = await deleteFetchCall(props.movieId);
        // Now that we get the response fron the backend, we need to write a message to the user, close the modals and refetch the movies on the home page
        console.log(response);
        if(!response.error){
            setUpdateMessage('We are deleting your movie...');
            setTimeout(()=>{
                setHasError(false);
                setIsLoading(false);
                props.hideModal();
                props.hideMovieDetails();
            },1500);
        } else{
            setUpdateMessage(response.message);
            setHasError(true);
        }
        

    };

    console.log("from delete update modal, movie id: " + typeof(props.movieId));

    /**Establish the correct output based on the state of the reducer */
    switch (props.actionType.method) {
        case 'delete':
            outcomesText = <p className={classes.outcomes}>By deleting this movie, you won't be able to see it on your page anymore and you will lose all data associated with it.
                If you really want to delete press the proceed button
            </p>
            break;
        case 'update':
            outcomesText = <p className={classes.outcomes}>We are not able to update movie data yet, this feature will be added when we will have the comments feature</p>
        break;
    
        default:
            outcomesText = <p className={classes.outcomes}>An error occured, click outside of this modal to close it</p>
            break;
    };

    return (
        <>
            <BackDrop backdropHandler={props.modalHandler}/>
            <div className={classes.modal}>
                <h2 className={classes.title}>Are you sure that you want to {props.actionType.method}?</h2>
                {/* <p className={classes.outcomes}>The possible outcomes of the action</p> */}
                {outcomesText}
                <p className={hasError ? classes.errorUpdate : classes.update}>{updateMessage}</p>
                <button className={classes.modalButton} onClick={onProceedHandler}>Proceed</button>
                <button className={classes.modalButton} onClick={props.modalHandler}>Cancel</button>
                {isLoading && <LoadinSpinner />}
            </div>
        </>
    );
};
export default DeleteUpdateModal;