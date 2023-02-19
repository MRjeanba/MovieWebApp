import { useState } from 'react';
import classes from './AddFilmForm.module.css';
import Button from './Button';


const AddFilmForm = (props) => {

    // On the submission of the form, we want to make a get request to the api
    const submitFormHandler = (ev) => {
        ev.preventDefault();

        // create an object from the inputs
        const movieToSearch = {
            name: nameInput,
            year: yearInput
        };

        //Make request to the API
        
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