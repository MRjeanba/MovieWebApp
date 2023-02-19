


// Should be able to "filter" the items with this component, so manage state that listen to key stroke
// And display movie items that correspond to these key entered by the user 
const SearchBar = (props) => {
    return (
        <>
            <label htmlFor="searchItem"></label>
            <input className={props.className} type="text" placeholder="Search here!" name="searchItem"></input>
        </>

    )
};

export default SearchBar;