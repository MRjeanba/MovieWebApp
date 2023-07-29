


// Should be able to "filter" the items with this component, so manage state that listen to key stroke

import { useContext, useEffect, useState } from "react";
import MoviesContext from "../../Contexts/MoviesContext";

// And display movie items that correspond to these key entered by the user 
const SearchBar = (props) => {
    const [searchedMovie, setSearchedMovie] = useState("");
    const movieCtx = useContext(MoviesContext);
    
    function setSearchedMovieHandler(ev){
        setSearchedMovie(ev.target.value);
    }

    function filterMovies(searchedMovie){
        const arrayOfMovies = Object.values(movieCtx.movies);

        let filteredMovies =arrayOfMovies.filter((movie) => { return movie.title.toLowerCase().includes(searchedMovie.toLowerCase())});
        console.log(filteredMovies);

        if(filteredMovies.length > 0){
            props.bringUpFilteredMovies(filteredMovies);
            console.log(filteredMovies);
        }
        return;
    };

    useEffect(() => {
        filterMovies(searchedMovie);
    }
        , [searchedMovie]);

    return (
        <>
            <label htmlFor="searchItem"></label>
            <input className={props.className} type="text" placeholder="Search here!" name="searchItem" onChange={setSearchedMovieHandler} value={searchedMovie}></input>
        </>

    )
};

export default SearchBar;