import classes from './LoadingSpinner.module.css';

const LoadingSpinner = (props) => {
    
    return (
        <>
            <span className={classes.loader}></span>
            <h4 className={classes.message}>{props.text}</h4>
        </>
    )
}

export default LoadingSpinner;