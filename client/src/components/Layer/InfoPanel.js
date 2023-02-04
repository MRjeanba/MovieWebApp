import styles from './InfoPanel.module.css';

const InfoPanel = () => {

    return(
        <div className={styles.panel}>
            <h2 className={styles.text + " " +styles.title}>Hello Welcome to My Movie Website !</h2>
            <p className={styles.text}>On this website, you can add and review movies that you watched and share it to your friends !</p>
        </div>  
    )
};

export default InfoPanel;