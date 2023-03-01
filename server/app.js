// server/app.js

/**
 * TO DO : STORE MOVIE DATA TO DATABASE!!! then when user come back, he is still able to see it's movies
 */
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3001;
const request = require('request');

const app = express();

app.use(bodyParser.json());

// To be able to get data in req.body
app.use(bodyParser.urlencoded({ extended: true }));

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

        // Send back the new object to the front end
        res.send(JSON.stringify(newMovieItem));
    });

});


app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});