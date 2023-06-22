const request = require('request');
const movieRepo = require('../Repository/MovieRepository');
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
            if(await movieRepo.findMovieById(movieData.results[0].id, false)){
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
 * @param {Integer} review the Integer value given by the user as a review
 * @param {mongoose.Objectid} movieId the Id(_id) of the movie of which we wanna add a review
 * @return {success:bool} an object containing a field succes that holds a boolean
 */
async function addReview(review, movieId) {

    //Use the add review method from the movie repo, if successfull return true
    const successObj = await movieRepo.addReviewToMovie(review, movieId)

    if (successObj.success) {
        return { success: true }
    } else {
        return { success: false }
    }
}

module.exports = {
    getMovie,
    addReview,
}