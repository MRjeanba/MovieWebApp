import { useRef, useState } from 'react';
import classes from './LoginPage.module.css';
import LoadingSpinner from '../UX/LoadingSpinner';

async function loginSignInFetch(uName, pwd, currentFetch){
    const userData = {userName: uName, password: pwd};

    if(currentFetch === "login"){ // post request to api to create a token
        const response = await fetch('api/login',{
            method: "post",
            headers:{
                'Content-Type': 'application/json'
             },
            body: JSON.stringify(userData)
        });
         const data = 1;//await response.json();
        // console.log(data);
        return data;
    }
};

const LoginPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(undefined);
    const uNameRef = useRef();
    const pwdRef = useRef();

    function loginHandler(){
        //setIsLoading(true);
        // basic verification from the FE (trim it and check if empty)
        const uName = uNameRef.current.value.trim();
        const pwd = pwdRef.current.value.trim();
        if(uName.length === 0){
            setHasError({message: "You provided an empty user name..."});
            return;
        } else if(pwd.length < 6) {
            setHasError({message: "This password is too short"});
        }
        const test = loginSignInFetch(uName, pwd, "login");

    }

    return(
        <div className={classes.modal}>
        <h2 className={classes.title}>You need to log in or create an account to continue!</h2>
        <input ref={uNameRef} className={classes.firstInput} type='text' placeholder='username'/>
        <input ref={pwdRef} type='password' placeholder='password'/>
        <button className={classes.modalButton} onClick={loginHandler}>Sign in</button>
        <button className={classes.modalButton} onClick={() => {}}>Create account</button>
        {isLoading && <p className={classes.update}>Verifying your informations...</p>}
        {hasError && <p className={classes.errorUpdate}>{hasError.message}</p>}
        {isLoading && <LoadingSpinner />} 
        </div>
    )
};

export default LoginPage;