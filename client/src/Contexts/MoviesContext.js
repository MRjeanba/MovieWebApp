
import React from "react";

const MoviesContext = React.createContext({ 
    movies: [{}],
    addMovie: (item) => {},
    removeMovie: (id) => {}
});

export default MoviesContext;