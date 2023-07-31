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
  const [ token, setToken ] = useState(localStorage.getItem("token"));
  const apiUrl = "https://frozen-beach-71970-3182c8239bba.herokuapp.com/";

  // if we want to logout the user, we need first to delete its token in the backend and then delete it on the front
  async function logout(){
    const response = await fetch(apiUrl+"api/logout");
    const deletion = await response.json();

    if (deletion.status == 200){
      deleteTokenClientSide()
    }
    window.location.reload();
  }

  function authenticate(){
    setToken(()=> localStorage.getItem("token"));
  }
  function deleteTokenClientSide(){
    localStorage.removeItem("token");
    setToken(()=> "");

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

  const bringUpFilteredMovies = (filteredMovies) => {
    setMoviesStored(filteredMovies);
  };


  const firstFetch = async () => {
    setIsLoading(true);
    const response = await fetch(apiUrl+"api/storedMovies");
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
        <Header showForm={showForm} logout={logout}/>
        {isFormShown && <AddFilmForm hideForm={hideForm} addMovie={addMovie} />}
        <InfoPanel bringUpFilteredMovies={bringUpFilteredMovies}/>
        {isLoading && <LoadingSpinner text="Retrieving your movies..." />}
        <MovieItems filteredMovies={moviesStored} displayMovie={displayMovieData} />
        {movieDetails != null && <MovieDetails displayMovieData={displayMovieData} details={movieDetails} />}
      </MoviesProvider> : <LoginPage authenticate={authenticate}/>
    }
    </>
    

  );
}
export default App;
