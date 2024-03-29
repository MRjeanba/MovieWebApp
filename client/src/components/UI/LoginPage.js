import { useRef, useState } from 'react';
import classes from './LoginPage.module.css';
import LoadingSpinner from '../UX/LoadingSpinner';
import Button from './Button';

async function loginSignInFetch(uName, pwd, currentFetch) {
    const userData = { userName: uName, password: pwd };
    const apiUrl = "https://frozen-beach-71970-3182c8239bba.herokuapp.com/";

    if (currentFetch === "login") { // post request to api to create a token
        const response = await fetch(apiUrl+'api/login', {
            method: "post",
            headers: {
                'Content-Type': 'application/json',
                credentials: 'include'                
            },
            body: JSON.stringify(userData)
        });
        const token = await response.json();
        return token;       
    } else { // post request to the api to create a new user
        const response = await fetch(apiUrl+'api/registerUser', {
            method: "post",
            headers: {
                'Content-Type': 'application/json',
            },
/*             credentials: 'include',
 */            body: JSON.stringify(userData)
        });
        const message = await response.json(); // the backend returns a message to give info about the user creation process
        alert(message.message);
        return message;
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
            setIsLoading(true);
            const token = await loginSignInFetch(uName, pwd, requestType);

            if (!token.login) {
                setHasError({ message: "The given informations are not correct..." });
                setIsLoading(false);
            }
            else {
                localStorage.setItem('tokenTime', token.tokenExpiration);
                localStorage.setItem('token', token.token);
                setIsLoading(false);
                props.authenticate();
            }
        } else {
            setIsLoading(true);
            //store the confirmation message inside of a variable, this message is returned by the BE from a call on a route to create a new user
            const response = await loginSignInFetch(uName, pwd, requestType);

            if (!response.login) {
                setHasError({ message: response.message });
                setIsLoading(false);
            }
            else {
                localStorage.setItem('tokenTime', response.tokenExpiration);
                localStorage.setItem('token', response.token);
                setIsLoading(false);
                props.authenticate();
            }
        }
        

    }

    return (
        <>
            <img className={classes.logo} src='/movieIcon.jpg' alt='Oops, it should be a movie icon...' />
            <div className={classes.modal}>
                <h2 className={classes.title}>You need to log in or create an account to continue!</h2>
                <input ref={uNameRef} className={classes.firstInput} type='text' placeholder='username' />
                <input ref={pwdRef} type='password' placeholder='password' />
                <Button className={classes.modalButton} name='login' onClick={() => loginHandler("login")}>Log in</Button>
                <Button className={classes.modalButton} onClick={() => loginHandler("register")}>Create an account</Button>
                {isLoading && <p className={classes.update}>Verifying your informations...</p>}
                {hasError && <p className={classes.errorUpdate}>{hasError.message}</p>}
                {isLoading && <LoadingSpinner />}
            </div>
        </>
    )
};

export default LoginPage;