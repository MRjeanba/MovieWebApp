import BackDrop from './BackDrop';
import classes from './DeleteUpdateModal.module.css';

const DeleteUpdateModal = (props) => {

    /**Add logic for delete/update calls here */
    /**Add the logic to retrieve movie information here(pass from MovieDetails to deleteUpdateModal) */
    return (
        <>
            <BackDrop backdropHandler={props.modalHandler}/>
            <div className={classes.modal}>
                <h2 className={classes.title}>The action you wanna perform</h2>
                <p className={classes.outcomes}>The possible outcomes of the action</p>
                <button className={classes.modalButton}>Proceed</button>
                <button className={classes.modalButton} onClick={props.modalHandler}>Cancel</button>
            </div>
        </>

    );
};
export default DeleteUpdateModal;