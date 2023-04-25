import Button from '../UI/Button';
import styles from './Header.module.css';
const Header = (props) => {

    return(
        <header>
            <img className={styles.logoTitle} src='/movieIcon.jpg' alt='Oops, it should be a movie icon...'/>
            <h2>Movie Enjoyer</h2>
            
            <Button className={styles.button} onClick={props.showForm}>+Add Movie</Button>
            
        </header>
    )
};

export default Header