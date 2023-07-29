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
const nodemailer = require("nodemailer");

// set up of the mail transport object
var smtpTransport = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    auth: {
        user: process.env.WEBMASTER,
        pass: process.env.EMP,
    }
});

mongoose.set('strictQuery', false);

const app = express();

// To be able to get data in req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect("mongodb+srv://jeanba19:"+process.env.CLUSTER+"@clustermoviewebapp.2rflxi7.mongodb.net/movieDB");


const apiKey = process.env.APIKEY;
const movieURL = 'https://api.themoviedb.org/3/search/movie?api_key=' + apiKey + '&query=';
const imageUrl = "https://image.tmdb.org/t/p/w400/";



// When user makes a get request for a movie, we make the request to the API and send back the data
app.get('/api/:movieName/:movieYear', authenticationMiddleware,  async (req, res) => {

    movieName = req.params.movieName;
    movieYear = req.params.movieYear;

    //We get the movie from the external API
    await serverMethods.getMovie(movieURL, movieName, movieYear, imageUrl, async (result) => {
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

    if (!token.login) {
        res.send(JSON.stringify({ login: false }));
    } else {
        // protects the token by providing it only during the requests
        res.cookie('token', token, {
            maxAge: 3600000,
            httpOnly: true
        });
        res.send(JSON.stringify({ tokenExpiration: '3600000', login: true }));

    }

});

app.get('/api/logout', async(req,res) => {

    // Grab the user token from the request
    const token = req.cookies['token'];
    console.log("user token to be deleted: "+ token?.token);

    // clear it and redirect the user
    res.clearCookie("token");
    res.send({status:200,message:"token deleted from the request"});
});


// Route that handles the user creation
app.post('/api/registerUser', async(req,res) => {

    // we create a temporary hash for te user, this will serve to identify the non validated user in db and then update their active property later
    const temp = crypto.randomBytes(64).toString('hex');

    const userObj = {
        username: req.body.userName,
        password: req.body.password,
        active: false,
        tempHash: temp,
    };

    // the active prop of the user is actually false,
    // since he did not have been verified by the web master, he cannot use the routes of the api (middleware check the active prop)
    //Once the webmaster accepts the user, he should now be able to call the routes of the api once logged in 

    const userRepoResponse = await userRepo.register(userObj);
    const activationLink = "http://localhost:3001/api/user/validateUser/" + userObj.tempHash;
    var mail = {
        from: "frenchWebMaster@outlook.fr",
        to: "jeanba19@outlook.fr",
        subject: "User creation request",
        text: "Plaintext version of the message",
        html: "<h2>Hello dear Jean-Baptiste</h2> <br/> <p>The user "+userObj.username+" wants to access your wonderful application</p> <br/> <p>Do you want to let this noob access it ? if yes press the link dear god </p> <br/> <p>link: "+activationLink+"</p>"
      };
    
    smtpTransport.sendMail(mail, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log("email is sent, additional info: " + info.accepted + "\n" + response);
        }
    });

    // Set a timeout to resolve the race between the login and register function called higher
    setTimeout(async () => {
        const token = await userRepo.login(userObj);

        if (!token.login) {
            res.send(JSON.stringify({ login: false, message: token.message }));
        } else {
            // protects the token by providing it only during the requests
            res.cookie('token', token, {
                maxAge: 3600000,
                httpOnly: true
            });
            res.send(JSON.stringify({ tokenExpiration: '3600000', login: true, result: userRepoResponse.result, message: userRepoResponse.message }));

        }
    }
        , 1000)

    //res.send(JSON.stringify(message));


});

// Route responsible to validate the user (set the active prop to true) once the webmaster accept the account
app.get('/api/user/validateUser/:tempHash', async (req,res) => {

    const tempHash = req.params.tempHash;
    const result = await userRepo.updateUserActivity(tempHash);

    if (!result.error) {
        console.log("The user should have been correctly updated: " + result.message);
        res.send(JSON.stringify(result));
    } else {
        console.log("An error occured during the user update: " + result.message);
        res.send(JSON.stringify(result))
    }
});

app.post('/api/AddReview',authenticationMiddleware, async(req,res) => {

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
    const token = req.cookies['token']
    console.log("user token: "+ token)

    if(token == null) return res.send({error:true, message:'You are not authenticated, try to refresh the page', status:401});
    if(token.token === undefined) return res.send({error:true, message:'You are not authenticated, try to refresh the page',status:403});
    //if(err) return res.sendStatus(500).send({error:true, message:'An error occured in our servers'});


    jwt.verify(token.token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
        console.log("You are verifying the created token");
        if(err) return res.send({error:true, message:'You are not authorized to use this resource',status:403});
        req.user = user; // identify the user 
        // now we want to search in db for the user, then check its active attribute and verify that it is true for active if not we dont continue the pipeline
        console.log(user);
        userName = user.uName;
        const activeValue = await userRepo.determineUserActiveField(userName);
        if(activeValue){
            next();
        } else {
            res.send({error:true, message:"Your account is not accepted yet... You will be able to do operation on the web application once verified",status:200});
        }
    });
    
}

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});