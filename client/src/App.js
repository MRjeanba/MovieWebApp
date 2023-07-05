import Header from "./components/Layer/Header";
import InfoPanel from "./components/Layer/InfoPanel";
import MovieItems from "./components/Movie/MovieItems";
import AddFilmForm from "./components/UI/AddFilmForm";
import { useState, useEffect } from "react";
import LoadingSpinner from "./components/UX/LoadingSpinner";
import MovieDetails from "./components/UI/MovieDetails";
import MoviesProvider from './Provider/MoviesProvider';
import LoginPage from "./components/UI/LoginPage";
function App() {

  const [ isFormShown, setIsFormShown ] = useState(false);
  const [ moviesStored, setMoviesStored ] = useState([]); // Deprecated, use the context instead, remove it if nothing breaks
  const [ isLoading, setIsLoading ] = useState(false);
  const [ movieDetails, setMovieDetails ] = useState(null);
  const [ isAuthenticated, setIsAuthenticated ] = useState(false);

  const token = localStorage.getItem("token");

  function authenticate(){
    setIsAuthenticated(true);
  }
  const showForm = () =>{
    setIsFormShown(true);
  };
  const hideForm = () => {
    setIsFormShown(false);
  };
  const displayMovieData = (movieObject) => {
    setMovieDetails(movieObject);
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

    if (token != null) {
      firstFetch();

      // Destroy the client token after some time, user won't be able to do request anymore and will be redirected to loginPage
      setTimeout(()=>{
        localStorage.removeItem('token');
      },1800000);
    }

  }, [token]);

  
  return (
    
    <>
    { token !== null ?
      <MoviesProvider>
        <Header showForm={showForm} />
        {isFormShown && <AddFilmForm hideForm={hideForm} addMovie={addMovie} />}
        <InfoPanel />
        {isLoading && <LoadingSpinner text="Retrieving your movies..." />}
        <MovieItems displayMovie={displayMovieData} />
        {movieDetails != null && <MovieDetails displayMovieData={displayMovieData} details={movieDetails} />}
      </MoviesProvider> : <LoginPage authenticate={authenticate}/>
    } 
    </>
    

  );
}

export default App;
 