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
const imageUrl = "https://image.tmdb.org/t/p/w300/";

let newMovieItem = {};

// When user makes a get request for a movie, we make the request to the API and send back the data
app.get('/api/:movieName/:movieYear', (req, res) => {

    movieName = req.params.movieName;
    movieYear = req.params.movieYear;

    console.log("Communication is working!");

    request(movieURL + movieName + '&year=' + movieYear, function (error, response, body) {

        // if (error) {
        //     //console.log('error:', error); // Print the error if one occurred and handle it
        //     //We just put an error prop to the new Movie item and give informations to the user about the error
        //     newMovieItem = { error: true };
        //     res.send(JSON.stringify(newMovieItem));
        //     return;
        // }
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received

        // transform the string into an JS object
        const movieData = JSON.parse(body);
        console.log(movieData);
        try {
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
            newMovieItem = { error: true };
            // res.send(JSON.stringify(newMovieItem));
            // return;
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


app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});