// this repository should allow these operations on the User collection: Find & Add
// The registration part can be done later, try to start with the Find method
const User = require('../Models/UserModel');
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();

/**
 * Create in the database a new user
 * @param {*} userObj The user we are tryng to add in DB
 * @returns a message that indicates whether or not if the user creations has been successfully done
 */
async function register(userObj) { // will use the bcrypt library to hash and save hashed passwords!!

    const verifyUname = await findUser(userObj.username.toString().trim());

    // Some verifications are done before processing with the creation
    if(!verifyUname.error){
        console.log(verifyUname);
        return {result:false, message: "Try to use an other username please."};
    }


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

    return {result:false, message: "Your account has been successfully saved!, try to log in now!"};

}

/**
 * 
 * @param {*} userObj The user we are trying to authenticate
 * @returns the access token object, it contains a boolean 'login' and the 'token' string
 */
async function login(userObj) {
    const userPwdHashed = await findUser(userObj.username.toString().trim());
    if(userPwdHashed.error){
        const token = { login: false, message: 'This user does not exists...' };
        return token;
    }

    const match = await bcrypt.compare(userObj.password.toString(), userPwdHashed);
    const userToIncludeInToken = {uName:userObj.username};
    if (match) {
        console.log('user credentials work!!, creating the token...');
        const accessToken = jwt.sign(userToIncludeInToken, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'});
        const token = { login: true, token: accessToken};
        return token;
    } else {

        console.log('no match in the db...');
        const token = { login: false, message: 'Unable to authenticate' };
        return token;
    }

}
/**
 * 
 * @param {String} usernameToFind the username of the user we tryna find
 * @returns an object containing the fields error:boolean message:string or the hash password if user found
 */
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

/**
 * 
 * @param {String} tempHash The string representing the temporary hash of the user that has not been verified yet
 * @returns an object in form { error: boolean, message: String } containing the state whether or not the user has been updated
 */
async function updateUserActivity(tempHash) {
    const user = await User.User.find({ tempHash: tempHash });

    if (user[0]?.active === false) {

        await User.User.updateOne(
            { tempHash: tempHash },
            { active: true }
        );
        await User.User.updateOne(
            { tempHash: tempHash },
            { $unset: "tempHash" }
        );
        return { error: false, message: "The user has successfully been updated in the database"}
    }
    else {
        return { error: true, message: 'Unable to update this user activity...' };
    }
}
/**
 * 
 * @param {String} userName the username of the user whose we want to check the active property
 * @returns whether true of false depending of its active field
 */
async function determineUserActiveField(userName){

    const existantUser = await User.User.find({ userName: userName });
    console.log(existantUser);

    if (existantUser[0]?.userName) {
        return existantUser[0]?.active;
    }
    else {
        return false; // Since this method will be used in middleware, we return false if we dont find the user
    }
}

module.exports = {
    login,
    register,
    determineUserActiveField,
    updateUserActivity,
}