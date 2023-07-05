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

/**
 * 
 * @param {*} givenId the id of the movie object that we want to retrieve, if secretID is false then we provide the simple id, if true provide the _id
 * @param {*} secretID indicates to the function if you provide the _id or the id of the movie false = id | true = _id
 * @returns 
 */
async function findMovieById(givenId, secretID) {

    if (!secretID) {
        const movie = await Movie.Movie.find({ id: givenId });
        if (movie.length === 0) {

            return false;
        }
        return movie;
    } else {
        const objectId = new mongoose.Types.ObjectId(givenId);
        const movie = await Movie.Movie.find({ _id: objectId });
        if (movie.length === 0) {

            return false;
        }
        return movie;
    }
    
}

/**
 * 
 * @param {*} review the review that we want to add in the reviews of the movie
 * @param {*} movieId the _id of the movie of which we wanna add the review
 * @returns an object of format { success: boolean, message:string } depending on the result of the queries
 */
async function addReviewToMovie(review, movieId) {

    const objectId = new mongoose.Types.ObjectId(movieId);

    try {
        await Movie.Movie.updateOne(
            { _id: objectId },
            { $push: {localReviews: review} }
        );

        return { success: true }
    } catch (error) {
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