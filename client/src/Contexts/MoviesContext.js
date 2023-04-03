
import React from "react";

const MoviesContext = React.createContext({ 
    movies: [{}],
    addMovie: () => {},
    removeMovie: () => {}
});

export default MoviesContext;