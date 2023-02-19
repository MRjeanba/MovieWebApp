import Header from "./components/Layer/Header";
import InfoPanel from "./components/Layer/InfoPanel";
import MovieItems from "./components/Movie/MovieItems";
import AddFilmForm from "./components/UI/AddFilmForm";
import { useState } from "react";

function App() {

  const [ isFormShown, setIsFormShown ] = useState(false);
  const [ moviesStored, setMoviesStored ] = useState([]);

  const showForm = () =>{
    setIsFormShown(true);
  };
  const hideForm = () => {
    setIsFormShown(false);
  }
  
  return (
    <>
      <Header showForm={showForm}/>
      {isFormShown && <AddFilmForm hideForm={hideForm} addMovie={setMoviesStored}/>}
      <InfoPanel />

      <MovieItems />
    </>

  );
}

export default App;
