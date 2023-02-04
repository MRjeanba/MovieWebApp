//This component will serve as a container in which we will display content

import styles from './Card.module.css';

const Card = (props) => {


    return(
        <div className={styles.card}>
            {props.children}
        </div>
    )
};

export default Card;