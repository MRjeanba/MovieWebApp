import { useReducer, useEffect } from "react";
import MoviesContext from "../Contexts/MoviesContext";

const MoviesProvider = (props) => {
    const addMovie = movie => {
        dispatchMoviesAction({ type: 'ADD', movie: movie });
    };
    const removeMovie = id => {
        dispatchMoviesAction({ type: 'REMOVE', id: id });
    };

    const fetchMovies = async () => {
        const response = await fetch("api/storedMovies");
        const readableMovies = await response.json();
        return readableMovies;
    };

    const moviesContext = { 
        movies: fetchMovies(),
        addMovie: addMovie,
        removeItem: removeMovie
    };

    const [state, dispatchMoviesAction] = useReducer(reducer, moviesContext);

    function reducer(state, action) {
        if (action.type === 'ADD') {
            return {
                movies : [...state.movies, action.movie]
            };
        }
        else if (action.type === 'REMOVE'){
            return {
                movies: [...state.movies]
            };
        }

        throw Error('Unknown action. reducer function');
    }

    useEffect(()=> {
        async function updateMovies(){
            state.movies = await fetchMovies();
        }
        updateMovies();
    },[state])



    return (
        <MoviesContext.Provider value={state}>
            {props.children}
        </MoviesContext.Provider>
    );
};

export default MoviesProvider;