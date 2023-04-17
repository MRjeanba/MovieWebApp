// server/app.js
/**
 * @todo: Change all of the paths/ports to the ones that will be used in the server or in the DB cluster for MongoDB
 */
const Movie = require('./Models/MovieModel');
require('dotenv').config();
const mongoose = require('mongoose');
const express = require("express");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3001;
const serverMethods = require('./BuisnessLogic/serverMethods');
mongoose.set('strictQuery', false);
const app = express();

app.use(bodyParser.json());

// To be able to get data in req.body
app.use(bodyParser.urlencoded({ extended: true }));

// Connection to the DB
mongoose.connect("mongodb://localhost:27017/movieDB");

const apiKey = process.env.APIKEY;
const movieURL = 'https://api.themoviedb.org/3/search/movie?api_key=' + apiKey + '&query=';
const imageUrl = "https://image.tmdb.org/t/p/w400/";

// When user makes a get request for a movie, we make the request to the API and send back the data
app.get('/api/:movieName/:movieYear', async (req, res) => {

    movieName = req.params.movieName;
    movieYear = req.params.movieYear;

    //We get the movie from the external API
    await serverMethods.getMovie(movieURL, movieName, movieYear, imageUrl, async (result) =>{
        // We tchek here if the fetch resulted in an error or not
        if(result.error){
            res.send(JSON.stringify(result));
        } else{ // additional tcher when we save the movie fetched
            const isStored = await serverMethods.storeMovie(result);
            res.send(JSON.stringify(isStored));
        }
    });
});

// Route responsible to fetch and send back the mongoDB data of the stored movies
app.get('/api/storedMovies', async (req,res) => {

    let storedMovies = [];
    try {
        const dataM = await Movie.Movie.find({ });
        console.log(dataM);
        storedMovies = [...dataM];
    } catch (error) {
        console.log(error);
        storedMovies = { error: true, errMessage: error };
    }

    // Send back the stored objects to the front end
    res.send(JSON.stringify(storedMovies));
});

// Route responsible to handle delete call on a particular movie ID
app.post('/api/delete', async (req,res) => {

    const movieId = req.body.id;
    console.log(movieId);
    const queryResult = await serverMethods.deleteMovie(movieId);
    res.send(JSON.stringify(queryResult));
});

// Route that handles the login authentication
app.post('/api/login', (req, res) => {

    const userObj = {
        username: req.body.userName,
        password: req.body.password
    }

    
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});