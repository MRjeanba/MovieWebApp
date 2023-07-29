import Button from '../UI/Button';
import styles from './Header.module.css';
const Header = (props) => {

    return(
        <header>
            <img className={styles.logoTitle} src='/movieIcon.jpg' alt='Oops, it should be a movie icon...'/>
            <h2 className={styles.h2Header}>Movie Enjoyer</h2>
            <Button className={styles.button} onClick={props.showForm}>Add Movie</Button>
            <Button className={styles.button1} onClick={props.logout}>Logout</Button>
        </header>
    )
};

export default Header