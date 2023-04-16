import { useState } from 'react';
import classes from './LoginPage.module.css';
import LoadingSpinner from '../UX/LoadingSpinner';

const LoginPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(undefined);
    const [logging, setIsLoggingIn] = useState(false);
    return(
        <div className={classes.modal}>
        <h2 className={classes.title}>You need to log in or create an account to continue!</h2>
        <input className={classes.firstInput} type='text' placeholder='username'/>
        <input type='password' placeholder='password'/>
        <button className={classes.modalButton} onClick={() => {}}>Sign in</button>
        <button className={classes.modalButton} onClick={() => {}}>Create account</button>
        {isLoading && <p className={classes.update}>Verifying your informations...</p>}
        {hasError && <p className={classes.errorUpdate}>{hasError.message}</p>}
        {isLoading && <LoadingSpinner />} 
        </div>
    )
};

export default LoginPage;