import Button from '../UI/Button';
import styles from './Header.module.css';

const Header = () => {

    return(
        <header>
            <h2>Cool Title</h2>


            <div>
                <Button>+Add Movie</Button>
                <p>Username</p>
            </div>
            
        </header>
    )
};

export default Header