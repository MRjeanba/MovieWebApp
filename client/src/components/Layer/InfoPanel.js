import SearchBar from '../UI/SearchBar';
import styles from './InfoPanel.module.css';

const InfoPanel = () => {

    return(
        <div className={styles.panel}>
            <h2 className={styles.text + " " +styles.title}>Welcome to Movie Enjoyer!</h2>
            <p className={styles.text}>On this website, you can add and review movies that you watched and share your experience with your friends!</p>
            <SearchBar className={styles.searchInput}/>
        </div>  
    )
};

export default InfoPanel;