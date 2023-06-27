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
const crypto = require("crypto");

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
app.get('/api/storedMovies', async (req, res) => {

    let storedMovies = [];
    try {
        const dataM = await findAllMovies();
        storedMovies = [...dataM];
    } catch (error) {
        storedMovies = [...dataM];

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


// Route that handles the user creation
app.post('/api/registerUser', async(req,res) => {

    const temp = crypto.randomBytes(64).toString('hex');
    console.log("This is the temporary temphash for the user verif: "+temp)

    const userObj = {
        username: req.body.userName,
        password: req.body.password,
        active: false,
        tempHash: temp,
    };

    // the active prop of the user is actually false,
    // since he did not have been verified by the web master, he cannot use the routes of the api (middleware check the active prop)
    //Once the webmaster accepts the user, he should now be able to call the routes of the api once logged in 

    const message = await userRepo.register(userObj);


    res.send(JSON.stringify(message))


});

app.post('/api/AddReview', async(req,res) => {

    const review = req.body.review
    const movieId = req.body.movieId

    const result = await serverMethods.addReview(review,movieId)

    if (result.success) {
        res.send(JSON.stringify({status:200, message: 'The review has been correctly added to the movie!'}))
    } else {
        res.send(JSON.stringify({status:500, message: "An error occured, we weren't able to add your review..." })) 
    }

});

// middleware
function authenticationMiddleware(req,res,next){
    // const authHeader = req.headers['authorization'];
    const token = req.cookies['token']; //  && authHeader.split(' ')[1];
    console.log("hey???"+ token);

    if(token == null) return res.send({error:true, message:'You are not authenticated, try to refresh the page', status:401});
    if(token.token === undefined) return res.send({error:true, message:'You are not authenticated, try to refresh the page',status:403});
    //if(err) return res.sendStatus(500).send({error:true, message:'An error occured in our servers'});

    jwt.verify(token.token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        console.log("You are verifying the created token")
        if(err) return res.send({error:true, message:'You are not authorized to use this resource',status:403});
        req.user = user; // identify the user 
        next();
    });
    
}

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});