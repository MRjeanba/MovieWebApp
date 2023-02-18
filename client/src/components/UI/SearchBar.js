

const SearchBar = (props) => {
    return (
        <>
            <label htmlFor="searchItem"></label>
            <input className={props.className} type="text" placeholder="Search here!" name="searchItem"></input>
        </>

    )
};

export default SearchBar;