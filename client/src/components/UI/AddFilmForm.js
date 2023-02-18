import { useRef, useState } from 'react';
import classes from './AddFilmForm.module.css';
import Button from './Button';


const AddFilmForm = (props) => {

    // On the submission of the form, we want to make a get request to the api
    const submitFormHandler = (ev) => {
        ev.preventDefault();
    };

    const [nameInput, setnameInput] = useState('');
    const [yearInput, setyearInput] = useState(0);

    const nameInputChangeHandler = (ev) => {
        setnameInput(ev.target.value);
    }
    const yearInputChangeHandler = (ev) => {
        setyearInput(ev.target.value);
    }

    const nameEntered = useRef();
    const yearEntered = useRef();

    const formIsInvalidValid = nameInput.trim().length < 0 && yearInput <= 0;

    return (

        //Add a onclick to the div in order to reset the isShownForm to false
        <>
            <div className={classes.backdrop} onClick={props.hideForm}>
            </div>
            <div className={classes.modal}>
                <h3>Please enter informations about the film you want to add</h3>
                <form className={classes.addMovie} onSubmit={submitFormHandler}>
                    <label htmlFor='movieName'>Name of the movie:</label>
                    <input type='text' name='movieName' ref={nameEntered} onChange={nameInputChangeHandler}></input>
                    <label htmlFor='movieYear'>Year of publication:</label>
                    <input type='number' name='movieYear' ref={yearEntered} onChange={yearInputChangeHandler}></input>
                    <Button onClick={props.hideForm}>Cancel</Button> 
                    <Button disable={formIsInvalidValid}>Add this movie</Button>
                </form>
            </div>
        </>

    )

}
export default AddFilmForm;