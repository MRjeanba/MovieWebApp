

const Button = (props) => {
    return(
        <button type={props.type} label={props.label}>{props.children}</button>
    );
};

export default Button;