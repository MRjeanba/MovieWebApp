import { useContext, useState } from 'react';
import BackDrop from './BackDrop';
import classes from './DeleteUpdateModal.module.css';
import LoadinSpinner from '../UX/LoadingSpinner';
import MoviesContext from '../../Contexts/MoviesContext';

async function deleteFetchCall(movieId){

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

// TODO: We need to make two delete before deleting a movie...  find a way to improve this
const DeleteUpdateModal = (props) => {
    const moviesContext = useContext(MoviesContext);
    let outcomesText = '';
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(undefined);

    const onProceedHandler = async () => {
        console.log(props.movieId);
        setIsLoading(true);
        const response = await deleteFetchCall(props.movieId);
        console.log(response);
        if(!response.error){
            setTimeout(()=>{
                setHasError(undefined);
                setIsLoading(false);
                props.hideModal();
                props.hideMovieDetails();
                moviesContext.removeMovie(props.movieId);
            },1500);
        } else{
            setHasError(response);
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
                {outcomesText}
                <button className={classes.modalButton} onClick={onProceedHandler}>Proceed</button>
                <button className={classes.modalButton} onClick={props.modalHandler}>Cancel</button>
                {isLoading && <p className={classes.update}>Deleting your movie...</p>}
                {hasError && <p className={classes.errorUpdate}>{hasError.message}</p>}
                {isLoading && <LoadinSpinner />}
            </div>
        </>
    );
};
export default DeleteUpdateModal;