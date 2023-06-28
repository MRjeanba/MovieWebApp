import { useRef, useState } from 'react';
import classes from './LoginPage.module.css';
import LoadingSpinner from '../UX/LoadingSpinner';

/**
 * 
 * TODO: use a better logic to handle the tokens and the validity of them, I think it works well in backend but poorly in front end.
 */

async function loginSignInFetch(uName, pwd, currentFetch) {
    const userData = { userName: uName, password: pwd };

    if (currentFetch === "login") { // post request to api to create a token
        const response = await fetch('api/login', {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        const token = await response.json();
        return token;
    } else { // post request to the api to create a new user
        const response = await fetch('api/registerUser', {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const message = await response.json(); // the backend returns a message to give info about the user creation process
        alert(message.message);
    }
};

const LoginPage = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(undefined);

    const uNameRef = useRef();
    const pwdRef = useRef();

    async function loginHandler(requestType) {
        //setIsLoading(true);
        // basic verification from the FE (trim it and check if empty)
        const uName = uNameRef.current.value.trim();
        const pwd = pwdRef.current.value.trim();
        if (uName.length === 0) {
            setHasError({ message: "You provided an empty user name..." });
            return;
        } else if (pwd.length < 6) {
            setHasError({ message: "This password is too short" });
        }

        //Depending on the button pressed, we do either login or sign in
        if(requestType === "login"){
            const token = await loginSignInFetch(uName, pwd, requestType);

            if (!token.login) {
                setHasError({ message: "The given informations are not correct..." });
            }
            else {
                localStorage.setItem('token', token.tokenExpiration);
                props.authenticate();
            }
        } else {
            //store the confirmation message inside of a variable, this message is returned by the BE from a call on a route to create a new user
            const message = await loginSignInFetch(uName, pwd, requestType);

            if (!message.result) {
                setHasError({ message: message.message });
            }
            else {
                alert(message.message);
            }
        }
        

    }

    return (
        <div className={classes.modal}>
            <h2 className={classes.title}>You need to log in or create an account to continue!</h2>
            <input ref={uNameRef} className={classes.firstInput} type='text' placeholder='username'/>
            <input ref={pwdRef} type='password' placeholder='password' />
            <button className={classes.modalButton} name='login' onClick={() => loginHandler("login")}>Sign in</button>
            <button className={classes.modalButton} onClick={() => loginHandler("register")}>Create account</button>
            {isLoading && <p className={classes.update}>Verifying your informations...</p>}
            {hasError && <p className={classes.errorUpdate}>{hasError.message}</p>}
            {isLoading && <LoadingSpinner />}
        </div>
    )
};

export default LoginPage;