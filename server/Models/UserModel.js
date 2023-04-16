const mongoose = require('mongoose');
const { groupSchema } = require('./GroupModel');
mongoose.set('strictQuery', false);


// Creation of the user Schema 
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    password: String,
    userName: String,
    group: [groupSchema],
});

// Creation of the model, that uses the previous defined schema
const User = mongoose.model("User", userSchema);


module.exports = {
    userSchema,
    User
};