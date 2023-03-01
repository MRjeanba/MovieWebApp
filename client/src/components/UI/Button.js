
const Button = (props) => {
    return (
        <button className={props.className} onClick={props.onClick} onKeyDown={(e) => {
            if (e.key === "Enter") {
                return props.onClick;
            } else {
                return '';
            }
        }}>{props.children}</button>
    );
};

export default Button;