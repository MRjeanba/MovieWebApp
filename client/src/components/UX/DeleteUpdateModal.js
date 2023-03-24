import classes from './DeleteUpdateModal.module.css';

const DeleteUpdateModal = (props) => {
    
    return (
        <div className={classes.modal}>
            <h2>The action you wanna perform</h2>
            <p>The possible outcomes of the action</p>
            <button>Proceed</button>
            <button>Cancel</button>
        </div>
    );
};
export default DeleteUpdateModal;