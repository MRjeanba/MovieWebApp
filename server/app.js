// server/app.js
/**
 * @todo: Change all of the paths/ports to the ones that will be used in the server or in the DB cluster for MongoDB
 */
require('dotenv').config();
const mongoose = require('mongoose');
const express = require("express");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3001;
const request = require('request');

mongoose.set('strictQuery', false);
const app = express();

app.use(bodyParser.json());

// To be able to get data in req.body
app.use(bodyParser.urlencoded({ extended: true }));

// Connection to the DB
mongoose.connect("mongodb://localhost:27017/movieDB");

// Creation of the movie Schema 
const movieSchema = new mongoose.Schema({
    title: String,
    id: Number,
    overview: String,
    poster: String,
    release: String,
    review: Number
});

// Creation of the model, that uses the previous defined schema
const Movie = mongoose.model("Movie", movieSchema);


const apiKey = process.env.APIKEY;
const movieURL = 'https://api.themoviedb.org/3/search/movie?api_key=' + apiKey + '&query=';
const imageUrl = "https://image.tmdb.org/t/p/w400/";

let newMovieItem = {};

// When user makes a get request for a movie, we make the request to the API and send back the data
app.get('/api/:movieName/:movieYear', (req, res) => {

    movieName = req.params.movieName;
    movieYear = req.params.movieYear;

    console.log("Communication is working!");

    request(movieURL + movieName + '&year=' + movieYear, async function (error, response, body) {

        // if (error) {
        //     //console.log('error:', error); // Print the error if one occurred and handle it
        //     //We just put an error prop to the new Movie item and give informations to the user about the error
        //     newMovieItem = { error: true };
        //     res.send(JSON.stringify(newMovieItem));
        //     return;
        // }
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received

        // transform the string into an JS object
        const movieData = await JSON.parse(body);
        
        try {
            
            // If we enter here, it means that the fetch was unsuccessful so we can warn the user accordingly
            if(movieData.results.length === 0){
                throw new Error("We couldn't find the movie you are trying to add...");
            }
            // if the movie that we want to add already exist, then we throw an error and prevent the user
            if(await findMovieById(movieData.results[0].id)){
                throw new Error("This movie is already added...");
            }

            newMovieItem = {
                error: false,
                id: movieData.results[0].id,
                title: movieData.results[0].original_title,
                overview: movieData.results[0].overview,
                poster: imageUrl + movieData.results[0].poster_path,
                release: movieData.results[0].release_date,
                review: movieData.results[0].vote_average,
            };

        } catch (error) {
            console.log('error:', error); // Print the error if one occurred and handle it
            //We just put an error prop to the new Movie item and give informations to the user about the error
            newMovieItem = { error: true, message: error.message };
        }
        console.log(newMovieItem);
        // Check, if the error is not null, then we fetched an exisitng object
        // So we can store it in our database
        if (!newMovieItem.error) {
            const movieToInsert = new Movie({
                ...newMovieItem
            });
            delete movieToInsert.error; // the error prop is not defined in the schema so we get rid of it
            console.log("movie to insert in DB: " + movieToInsert);
            movieToInsert.save();
        }

        // Send back the new object to the front end
        res.send(JSON.stringify(newMovieItem));
    });

});

// Route responsible to fetch and send back the mongoDB data of the stored movies
app.get('/api/storedMovies', async (req,res) => {

    let storedMovies = [];
    try {
        const dataM = await Movie.find({ });
        console.log(dataM);
        storedMovies = [...dataM]
        console.log(storedMovies);
    } catch (error) {
        console.log(error);
        storedMovies = { error: true, errMessage: error };
    }

    // Send back the stored objects to the front end
    res.send(JSON.stringify(storedMovies));
});


/**
 * *******Helper methods for Database operations***********
 * 
 */

// Check in the database if a movie with the corresponding ID exists
const findMovieById = async (givenId) => {

    const movie = await Movie.find({id: givenId});
    if(movie.length === 0){
        return false;
    }
    console.log("here");
    return movie;
}


app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});