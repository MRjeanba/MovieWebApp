// server/app.js
/**
 * @todo: Change all of the paths/ports to the ones that will be used in the server or in the DB cluster for MongoDB
 */
const Movie = require('./Models/MovieModel');
require('dotenv').config();
const mongoose = require('mongoose');
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');
const PORT = process.env.PORT || 3001;
const serverMethods = require('./BuisnessLogic/serverMethods');
const userRepo = require('./Repository/UserRepository');
const MovieRepository = require('./Repository/MovieRepository');
const { findAllMovies } = require('./Repository/MovieRepository');

mongoose.set('strictQuery', false);

const app = express();

// To be able to get data in req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect("mongodb://localhost:27017/movieDB");


const apiKey = process.env.APIKEY;
const movieURL = 'https://api.themoviedb.org/3/search/movie?api_key=' + apiKey + '&query=';
const imageUrl = "https://image.tmdb.org/t/p/w400/";

// When user makes a get request for a movie, we make the request to the API and send back the data
app.get('/api/:movieName/:movieYear', authenticationMiddleware,  async (req, res) => {

    movieName = req.params.movieName;
    movieYear = req.params.movieYear;

    //We get the movie from the external API
    await serverMethods.getMovie(movieURL, movieName, movieYear, imageUrl, async (result) =>{
        // We tchek here if the fetch resulted in an error or not
        if(result.error){
            res.send(JSON.stringify(result));
        } else{ // additional tchek when we save the movie fetched
            const isStored = await MovieRepository.storeMovie(result);
            res.send(JSON.stringify(isStored));
        }
    });
});

// Route responsible to fetch and send back the mongoDB data of the stored movies
app.get('/api/storedMovies', async (req,res) => {

    let storedMovies = [];
    try {
        const dataM = await findAllMovies();
        console.log(dataM);
        storedMovies = [...dataM];
    } catch (error) {        storedMovies = [...dataM];

        console.log(error);
        storedMovies = { error: true, errMessage: error };
    }

    // Send back the stored objects to the front end
    res.send(JSON.stringify(storedMovies));
});

// Route responsible to handle delete call on a particular movie ID
app.post('/api/delete', authenticationMiddleware, async (req,res) => {

    const movieId = req.body.id;
    console.log(movieId);
    const queryResult = await MovieRepository.deleteMovie(movieId);
    res.send(JSON.stringify(queryResult));
});

// Route that handles the login authentication
app.post('/api/login', async(req, res) => {

    const userObj = {
        username: req.body.userName,
        password: req.body.password
    }

    const token = await userRepo.login(userObj);

    // protects the token by providing it only during the requests
    res.cookie('token',token,{
        maxAge: 3600000,
        httpOnly:true
    });
    res.send(JSON.stringify({tokenExpiration:'3600000',login:true}));

});

// middleware
function authenticationMiddleware(req,res,next){
    // const authHeader = req.headers['authorization'];
    const token = req.cookies['token']; //  && authHeader.split(' ')[1];
    if(token == null) return res.sendStatus(401).send({error:true, message:'You are not authenticated, try to refresh the page'});
    jwt.verify(token.token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.status(403).send({error:true, message:'You are not authorized to use this resource'});
        req.user = user; // identify the user 
        next();
    })
}

function generateAccessToken(user){
    return jwt.sign(userObj, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15s'});
}

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});