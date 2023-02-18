import Button from '../UI/Button';
import styles from './Header.module.css';

const Header = (props) => {

    return(
        <header>
            <h2>Movie Enjoyer</h2>
            
            <div className={styles.headerDiv}>
                <Button onClick={props.showForm}>+Add Movie</Button>
                <p>Username</p>
            </div>
            
        </header>
    )
};

export default Header