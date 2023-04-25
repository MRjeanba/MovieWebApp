// this repository should allow these operations on the User collection: Find & Add
// The registration part can be done later, try to start with the Find method
const User = require('../Models/UserModel');
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();

/**
 * 
 * @param {*} userObj The user we are tryng to add in DB
 */
// Search in the database for a particular user
async function registerNewUser(userObj) { // will use the bcrypt library to hash and save hashed passwords!!

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

/**
 * 
 * @param {*} userObj The user we are trying to authenticate
 * @returns the access token object, it contains a boolean 'login' and the 'token' string
 */
async function login(userObj) {
    const userPwdHashed = await findUser(userObj.username.toString().trim());
    const match = await bcrypt.compare(userObj.password, userPwdHashed);
 
    if (match) {
        console.log('user credentials work!!, creating the token...');
        const accessToken = jwt.sign(userObj, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15s'});
        //const refreshToken = jwt.sign(userObj, process.env.REFRESH_TOKEN_SECRET);
        const token = { login: true, token: accessToken}; //refreshToken: refreshToken };
        return token;
    } else {

        console.log('no match in the db...');
        const token = { login: false, message: 'Unable to authenticate' };
        return token;
    }

}

// Find a certain user in the DB
async function findUser(usernameToFind) {
    const existantUser = await User.User.find({ userName: usernameToFind });
    console.log(existantUser);

    if (existantUser[0]?.userName) {
        return existantUser[0]?.password.toString(); // will return a hashed password
    }
    else {
        return { error: true, message: 'user not found...' };
    }
}

module.exports = {
    login,
}