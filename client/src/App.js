import Header from "./components/Layer/Header";
import InfoPanel from "./components/Layer/InfoPanel";
import Card from "./components/Movie/Card";
import MovieItems from "./components/Movie/MovieItems";

function App() {

  return (
    <>
      <Header />
      <InfoPanel />
      
      <Card>
        <MovieItems />
      </Card>
    </>

  );
}

export default App;
