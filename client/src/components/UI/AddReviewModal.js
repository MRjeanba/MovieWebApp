import classes from './AddReviewModal.module.css';
import BackDrop from '../UX/BackDrop';

const AddReviewModal = (props) => {



    return(
            <>
                <BackDrop backdropHandler = {props.hideModal} />
                <div className={classes.modal}>
                    <h2 className={classes.title}>{props.title}</h2>
                    <input className={classes.reviewInput} type="number" min={0} max={10} placeholder="Your rating out of 10"></input>
                    <button className={classes.modalButton}>Submit</button>
                    <button className={classes.modalButton} onClick={props.hideModal}>Cancel</button>
                </div>
            </>
    );
};

export default AddReviewModal;