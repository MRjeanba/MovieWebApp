const mongoose = require('mongoose');
mongoose.set('strictQuery', false);


// Creation of the user Schema 
const userSchema = new mongoose.Schema({
    password: String,
    userName: String,
    //group: [groupSchema],
    active: Boolean,
});

// Creation of the model, that uses the previous defined schema
const User = mongoose.model("User", userSchema);


module.exports = {
    userSchema,
    User
};