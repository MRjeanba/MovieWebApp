const mongoose = require('mongoose');
mongoose.set('strictQuery', false);


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


module.exports = {
    movieSchema,
    Movie
};