import { useState } from 'react';
import classes from './AddFilmForm.module.css';
import Button from './Button';


const AddFilmForm = (props) => {

    const [fetchError, setFetchError] = useState(false);
    const [nameInput, setnameInput] = useState('');
    const [yearInput, setyearInput] = useState('');

    let errorMessage = <p className={classes.errorFetch}>An error occured while searching for your movie... Please retry!</p>;

    // fetch movies, we make a request to the back end that will make requests to the TMDB API
    async function fetchMovies(EnteredName, enteredYear){

        const response = await fetch('api/'+EnteredName+'/'+enteredYear);
        const movieData = await response.json();
        return movieData;
    };

    const nameInputChangeHandler = (ev) => {
        setnameInput(ev.target.value);
    };

    const yearInputChangeHandler = (ev) => {

        // some verification because if the user enter something then remove everything the app crash
        if(ev.target.value === ''){
            setyearInput('0');
        } else{
            setyearInput(ev.target.value);
        }
    };

    // On the submission of the form, we want to make a get request to the api
    const submitFormHandler = async(ev) => {
        ev.preventDefault();

        const movie = await fetchMovies(nameInput, yearInput);
        console.log(movie);
        if (movie.error) {
            setFetchError(true);
            setnameInput('');
            setyearInput('');
            return;
        }
        else {
            setFetchError(false);
            setnameInput('');
            setyearInput('');
            // no error, we just hide the form
            props.hideForm();
            props.addMovie(movie);
        }
    };

    // Determine the form validity and control the submit button in order to not get empty or inchoherent inputs
    const formIsInvalid = nameInput.trim().length === 0 || parseInt(yearInput) <= 1895 || yearInput.trim().length === 0;

    return (

        //Add a onclick to the div in order to reset the isShownForm to false
        <>
            <div className={classes.backdrop} onClick={props.hideForm}>
            </div>
            <div className={classes.modal}>
                <h3>Please enter informations about the film you want to add</h3>
                <form className={classes.addMovie} onSubmit={submitFormHandler}>
                    <label htmlFor='movieName'>Name of the movie:</label>
                    <input type='text' name='movieName' onChange={nameInputChangeHandler} value={nameInput}></input>
                    <label htmlFor='movieYear'>Year of publication:</label>
                    <input type='number' name='movieYear' onChange={yearInputChangeHandler} value={yearInput}></input>
                    <Button onClick={props.hideForm}>Cancel</Button> 
                    <Button className={formIsInvalid ? classes.disable : undefined}>Add this movie</Button>
                    {fetchError && errorMessage}
                </form>
            </div>
        </>

    )

}
export default AddFilmForm;