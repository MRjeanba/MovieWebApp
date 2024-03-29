import { useContext, useState } from 'react';
import BackDrop from '../UX/BackDrop';
import LoadingSpinner from '../UX/LoadingSpinner';
import classes from './AddFilmForm.module.css';
import Button from './Button';
import MoviesContext from '../../Contexts/MoviesContext';


const AddFilmForm = (props) => {
    const apiUrl = "https://frozen-beach-71970-3182c8239bba.herokuapp.com/";
    const [fetchError, setFetchError] = useState(null);
    const [nameInput, setnameInput] = useState('');
    const [yearInput, setyearInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const moviesContext = useContext(MoviesContext);

    // fetch movies, we make a request to the back end that will make requests to the TMDB API
    async function fetchMovie(EnteredName, enteredYear) {
        const response = await fetch(apiUrl+'api/' + EnteredName + '/' + enteredYear,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    credentials: "include",
                },
                body:{
                    token:localStorage.getItem('token')
                }
            });

        const movieData = await response.json();
        setIsLoading(false);
        
        return movieData;
    };

    const nameInputChangeHandler = (ev) => {
        setnameInput(ev.target.value);
    };

    const yearInputChangeHandler = (ev) => {

        // some verification because if the user enter something then remove everything the app crash
        if (ev.target.value === '') {
            setyearInput('0');
        } else {
            setyearInput(ev.target.value);
        }
    };

    // On the submission of the form, we want to make a get request to the api
    const submitFormHandler = async (ev) => {
        setIsLoading(true);
        ev.preventDefault();

        const movie = await fetchMovie(nameInput, yearInput);
        console.log(movie);

        if (movie.error) {
            if (movie.message) {
                console.log(movie.message);
                setFetchError(movie.message);
                if(movie.status === 401 || movie.status === 403) {
                    localStorage.removeItem("token");
                }
            }
            setnameInput('');
            setyearInput('');
            return;
        }
        else {
            setFetchError(null);
            setnameInput('');
            setyearInput('');
            moviesContext.addMovie(movie);
            // no error, we just hide the form
            props.hideForm();
        }
    };

    // Determine the form validity and control the submit button in order to not get empty or inchoherent inputs
    const formIsInvalid = nameInput.trim().length === 0 || parseInt(yearInput) <= 1895 || yearInput.trim().length === 0;

    return (

        //Add a onclick to the div in order to reset the isShownForm to false
        <>
            <BackDrop backdropHandler={props.hideForm} />
            <div className={classes.modal}>
                <h3>Please enter informations about the film you want to add</h3>
                <form className={classes.addMovie} onSubmit={submitFormHandler}>
                    <label htmlFor='movieName'>Name of the movie:</label>
                    <input type='text' name='movieName' onChange={nameInputChangeHandler} value={nameInput}></input>
                    <label htmlFor='movieYear'>Year of publication:</label>
                    <input type='number' name='movieYear' onChange={yearInputChangeHandler} value={yearInput}></input>
                    <Button onClick={props.hideForm}>Cancel</Button>
                    <Button className={formIsInvalid ? classes.disable : undefined}>Add this movie</Button>
                    {isLoading && <LoadingSpinner text="Adding your movie..." />}
                    {fetchError && <p className={classes.errorFetch}>{fetchError}</p>}
                </form>
            </div>
        </>

    )

};
export default AddFilmForm;