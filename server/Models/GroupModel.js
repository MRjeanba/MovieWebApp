const mongoose = require('mongoose');
const { User, userSchema } = require('./UserModel');
const { movieSchema } = require('./MovieModel');
mongoose.set('strictQuery', false);


// Creation of the movie Schema 
const groupSchema = new mongoose.Schema({
    name: String,
    users: [userSchema],
    movies: [movieSchema]
});

// Creation of the model, that uses the previous defined schema
const Group = mongoose.model("Group", groupSchema);


module.exports = {
    groupSchema,
    Group
};