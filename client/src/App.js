import Header from "./components/Layer/Header";
import InfoPanel from "./components/Layer/InfoPanel";
import MovieItems from "./components/Movie/MovieItems";
import AddFilmForm from "./components/UI/AddFilmForm";
import { useState, useEffect } from "react";
import LoadingSpinner from "./components/UX/LoadingSpinner";

function App() {

  const [ isFormShown, setIsFormShown ] = useState(false);
  const [ moviesStored, setMoviesStored ] = useState([]);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ isMovieShown, setShowMovie ] = useState(null);

  const showForm = () =>{
    setIsFormShown(true);
  };
  const hideForm = () => {
    setIsFormShown(false);
  };
  const displayMovieData = (movieObject) => {
    setShowMovie(movieObject);
  };

  const addMovie = (movieObj) => {
    
    setMoviesStored((prevState) => {
      return [movieObj, ...prevState];
    });

  };

  const firstFetch = async () => {
    setIsLoading(true);
    const response = await fetch("api/storedMovies");
    const readableMovies = await response.json();
    console.log(readableMovies);
    setMoviesStored([...readableMovies]);
    setIsLoading(false);
  };
  

  // At the first render, we fetch the movies from our database and display them in our state
  useEffect(() => {
    firstFetch();
  }, []);

  
  return (
    <>
      <Header showForm={showForm}/>
      {isFormShown && <AddFilmForm hideForm={hideForm} addMovie={addMovie}/>}
      <InfoPanel />
      {isLoading && <LoadingSpinner text="Retrieving your movies..."/>}
      <MovieItems moviesStored={moviesStored} displayMovie={displayMovieData}/>
    </>

  );
}

export default App;
