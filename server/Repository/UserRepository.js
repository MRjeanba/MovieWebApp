// this repository should allow these operations on the User collection: Find & Add
// The registration part can be done later, try to start with the Find method
const User = require('../Models/UserModel');
const mongoose = require('mongoose');

// Search in the database for a particular user
async function findUserInDb(givenId){

    if(movie.length === 0){
        return false;
    }
    console.log("we found this movie");
    return movie;
}

module.exports = {
    findMovieById,
    storeMovie,
    deleteMovie,
}