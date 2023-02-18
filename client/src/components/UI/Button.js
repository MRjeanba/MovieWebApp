 

const Button = (props) => {
    return(
        <button onClick={props.onClick} className={props.disable ? 'disable' : ''}>{props.children}</button>
    );
};

export default Button;