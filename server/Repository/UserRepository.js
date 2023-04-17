// this repository should allow these operations on the User collection: Find & Add
// The registration part can be done later, try to start with the Find method
const User = require('../Models/UserModel');
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

// Search in the database for a particular user
async function AuthenticateUser(userObj) { // will use the bcrypt library to hash and save hashed passwords!!

    bcrypt.hash(userObj.password, 10, async (err, hash) => {
        if (err) {
            console.log("An error occured during the hash...");
            // throw an error and return the error to the user...
        }
        const user = new User.User({ // we store the user with an hash password in the DB
            userName: userObj.username,
            password: hash
        });
        await user.save(); // to save the newly created user in the database

    });



}
// Verify password:
async function login(userObj) {
    const userPwdHashed = await findUser(userObj.username.toString().trim());
    console.log(userPwdHashed);
    const match = await bcrypt.compare(userObj.password, userPwdHashed);

    if (match) {
        console.log('user credentials work!!');
        const token = { login: true, token: '123' };
        return token;
    } else {

        console.log('no match in the db...');
        const token = { login: false };
        return token;
    }



}

// Find a certain user in the DB
async function findUser(usernameToFind) {
    const existantUser = await User.User.find({ userName: usernameToFind });
    console.log(existantUser);

    if (existantUser[0]?.userName) {
        return existantUser[0]?.password.toString(); // it is hashed
    }
    else {
        return { error: true, message: 'user not found...' };
    }
}

module.exports = {
    login,
}