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
      },3600000);
    }

  }, [token]);

  // we can manage the authentication here
  // steps to do next: 1- check in local storage if user has a token,
  // if he has one, then show him the page and do nothing, if not, ask for credentials of the user 
  // 2 - credentials are given, request the back end to authenticate and return token if correct (token should have a value and an expires value)
  // 3 - credentials not correct, then display an error message.

  // no empty array of dependencies, then it is done at each refresh
  // useEffect(() => {
    
  // })

  
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
 