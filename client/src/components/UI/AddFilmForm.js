import { useState } from 'react';
import classes from './AddFilmForm.module.css';
import Button from './Button';


const AddFilmForm = (props) => {

    // import the api key from the env file
    const movieAPIUrl = 'https://api.themoviedb.org/3/search/movie?api_key=' + ApiKey + '&query=';
    const imageUrl = "https://image.tmdb.org/t/p/w300/";

    // fetch movies from the TMDB API
    async function fetchMovies(EnteredName, enteredYear){
        
        // we build the url with the data entered by the user
        const response = await fetch(movieAPIUrl + EnteredName + '&year=' + enteredYear);
        const movieData = await response.json();
        const newMovieItem = {
            title: movieData.results[0].original_title,
            overview: movieData.results[0].overview,
            poster: imageUrl + movieData.results[0].poster_path,
            release: movieData.results[0].release_date,
            review: movieData.results[0].vote_average,
        };
        alert(newMovieItem);

        props.addMovie(newMovieItem);
    }

    // On the submission of the form, we want to make a get request to the api
    const submitFormHandler = (ev) => {
        ev.preventDefault();

        fetchMovies(nameInput, yearInput);
    };

    const [nameInput, setnameInput] = useState('');
    const [yearInput, setyearInput] = useState('');


    const nameInputChangeHandler = (ev) => {
        setnameInput(ev.target.value);
    }

    const yearInputChangeHandler = (ev) => {

        // some verification because if the user enter something then remove everything the app crash
        if(ev.target.value === ''){
            setyearInput('0');
        } else{
            setyearInput(ev.target.value);
        }
    }


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
                    <input type='text' name='movieName' onChange={nameInputChangeHandler}></input>
                    <label htmlFor='movieYear'>Year of publication:</label>
                    <input type='number' name='movieYear' onChange={yearInputChangeHandler}></input>
                    <Button onClick={props.hideForm}>Cancel</Button> 
                    <Button className={formIsInvalid && classes.disable}>Add this movie</Button>
                </form>
            </div>
        </>

    )

}
export default AddFilmForm;