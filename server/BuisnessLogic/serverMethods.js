const request = require('request');
const Movie = require('../Models/MovieModel');
const mongoose = require('mongoose');
/**
 * This method is responsible to make an external GET request to the TMDB API in order to get the data of the movie that the user wants to add
 * @param {*string The url of the TMDB API} movieURL 
 * @param {*string Name entered by the user} movieName 
 * @param {*string Date entered by the user} movieYear 
 */
async function getMovie(movieURL, movieName, movieYear, imageUrl, callback){
    
    request(movieURL + movieName + '&year=' + movieYear, async function (error, response, body) {
        
        if (error) {    
            console.log('error:', error); // Print the error if one occurred and handle it
            //We just put an error prop to the new Movie item and give informations to the user about the error
            throw new Error('An error occured while we tried to get the movie Data, it may be a network issue... Try later!');
        }
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        
        let newMovieItem = {};
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
                _id: new mongoose.Types.ObjectId(),
                id: movieData.results[0].id,
                title: movieData.results[0].original_title,
                overview: movieData.results[0].overview,
                poster: imageUrl + movieData.results[0].poster_path,
                release: movieData.results[0].release_date,
                review: parseFloat(movieData.results[0].vote_average).toFixed(1),
            };
            console.log(newMovieItem);
            callback(newMovieItem);
            
        } catch (error) {
            console.log('error:', error); // Print the error if one occurred and handle it
            //We just put an error prop to the new Movie item and give informations to the user about the error
            newMovieItem = { error: true, message: error.message };
            console.log(newMovieItem);
            callback(newMovieItem);
        }
    });
};

/**
 * 
 * @param {*Object The movie object that we want to store in our database} movieData 
 * @returns either the movie stored if the method is successull or a custom error object if we encountered a problem
 */
async function storeMovie(movieData) {

    // Check, if the error is not null, then we fetched an exisitng object
    // So we can store it in our database
    if (!movieData.error) {
        const movieToInsert = new Movie.Movie({
            ...movieData
        });
        delete movieToInsert.error; // the error prop is not defined in the schema so we get rid of it
        await movieToInsert.save();
        return movieData; // we return the actual movie if successfully stored
    }
    // we return false if we encountered an error when saving the movie
    return {error: true, message: "We encountered a problem while trying to save your movie..."};
};

/**
 * 
 * This method has as purpose to delete the selected movie from our database
 * @param {*ObjectId - the unique id of the movie in the DB} givenId
 * @returns an object containing an error state about the query, but also an informative message for the users
 */
async function deleteMovie(givenId){

    // We need to transform our string from the front end into an object ID to perform the query in mongo DB
    const objectId = new mongoose.Types.ObjectId(givenId);
    console.log('Object id to delete: ' + objectId);
    try {
        const result = await Movie.Movie.deleteOne({_id: objectId});
        console.log(result);
        if(result.acknowledged === true){
            
            return {error:false, message: 'the movie has been correctly deleted'};
        } else {
            return {error: false, message: 'we are not able to delete your movie... contact the developper'};
        }

    } catch (error) {
        console.log(error);
        return {error: true, message: 'An error occured, we were not able to delete your movie...'};
    }
    
}

// Check in the database if a movie with the corresponding ID exists
async function findMovieById(givenId){

    const movie = await Movie.Movie.find({id: givenId});
    if(movie.length === 0){
        return false;
    }
    console.log("here");
    return movie;
}

module.exports = {
    getMovie,
    storeMovie,
    deleteMovie,
}