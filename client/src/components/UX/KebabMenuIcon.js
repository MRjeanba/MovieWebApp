import classes from './KebabMenuIcon.module.css';
import { useReducer, useState } from 'react';
import DeleteUpdateModal from './DeleteUpdateModal';
const KebabMenuIcon = (props) => {

    // responsible to show the list given to the kebab menu
    const [showList, setShowList] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const hideModal = () => {
        setShowModal(false);
    };

    function reducer(state, action) {
        if (action.type === 'delete') {
            setShowModal(true);
            return {
                method: 'delete'
            };
        }
        else if (action.type === 'update') {
            setShowModal(true);
            return {
                method: 'update'
            };
        }
        alert("we are not able to perform this operation yet")
    };

    const [state, dispatch] = useReducer(reducer, {method: ''});

    const items = [...props.items];

    const onClickHandler = () => {
        setShowList((showList) => !showList);
    };
    const listItemHandler = (ev, item) => {
        ev.preventDefault();
        const actionType = item.toString().toLowerCase();
        dispatch({type: actionType});
    };

    const itemsInList = <ul className={classes.menu}>
        {items.map(item => <li className={classes.item} onClick={(e) => {
            listItemHandler(e, item);
        }}>{item}</li>)}
    </ul>;

    return (
        <>
            <div className={classes.kebabIcon} onClick={onClickHandler}>
            </div>
            {showList && itemsInList}
            {showModal && <DeleteUpdateModal modalHandler={hideModal}/>}
        </>


    );
};
export default KebabMenuIcon;