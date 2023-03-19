import classes from './BackDrop.module.css';

const BackDrop = (props) => {
    return (
        <div className={classes.backdrop} onClick={props.backdropHandler}>
        </div>
    )

}; export default BackDrop;