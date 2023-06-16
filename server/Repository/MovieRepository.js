/**
 * 
 * @param {*Object The movie object that we want to store in our database} movieData 
 * @returns either the movie stored if the method is successull or a custom error object if we encountered a problem
 */
const Movie = require('../Models/MovieModel');
const mongoose = require('mongoose');


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
    return { error: true, message: "We encountered a problem while trying to save your movie..." };
};

/**
 * 
 * This method has as purpose to delete the selected movie from our database
 * @param {*ObjectId - the unique id of the movie in the DB} givenId
 * @returns an object containing an error state about the query, but also an informative message for the users
 */
async function deleteMovie(givenId) {

    // We need to transform our string from the front end into an object ID to perform the query in mongo DB
    const objectId = new mongoose.Types.ObjectId(givenId);
    console.log('Object id to delete: ' + objectId);
    try {
        const result = await Movie.Movie.deleteOne({ _id: objectId });
        console.log(result);
        if (result.acknowledged === true) {

            return { error: false, message: 'the movie has been correctly deleted' };
        } else {
            return { error: false, message: 'we are not able to delete your movie... contact the developper' };
        }

    } catch (error) {
        console.log(error);
        return { error: true, message: 'An error occured, we were not able to delete your movie...' };
    }

}
async function findAllMovies() {

    const movies = await Movie.Movie.find({});
    return movies;
}

// Check in the database if a movie with the corresponding ID exists
async function findMovieById(givenId) {

    const movie = await Movie.Movie.find({ id: givenId });
    if (movie.length === 0) {

        return false;
    }
    console.log("we found this movie");

    return movie;
}

/**
 * 
 * @param {*} review the review integer entered by the user
 * @param {*} movieId the movie id of which we wanna add a review
 */
async function addReviewToMovie(review, movieId){

    const objectId = new mongoose.Types.ObjectId(movieId);
    const movie = findMovieById(objectId)

    if (movie) {
        // then, we add the new review to the array of reviews
        movie.localReviews.push(parseInt(review))
        return { success: true }
    } else {
        return { success: false, message: 'movie not found in the DB...' }
    }
}

module.exports = {
    findMovieById,
    storeMovie,
    deleteMovie,
    findAllMovies,
    addReviewToMovie,
}