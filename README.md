# MovieWebApp
The goal of this project is to familiarize myself with full stack development (MERN) stack.    
This project is a web application where people will be able to add/delete movies they watched,  
they will also be able to perform other operations like add reviews and also add comments on these movies  
First, they have to create an account, once the account successfully verified, they will be allowed to modify  
the content of the application.
  
The access to the majority of movies will be done with the help of the external API of TMDB.  
With their help I will be able to have access to a large amount of data related to movies.

# Technologies
FrontEnd:  
- React  
- HTML  
- CSS  
  
BackEnd:
- Node.js / Express.js  
- MongoDB

# Authentication
To manage authentication, I chose to use the jwt library to generate token.  

Token:  
The token is generated from a random string and associated with users when they are logging in,  
if the user successfully login we store the token in its cookies and keep track of its expiration time on the server side  

Middleware:  
On each CRUD routes of the api, I added a middleware responsible to check if the user that is trying to attempt a CRUD operation possesses a token that we generated, if not we warn the user and ask him to log in again.  
If yes, then we proceed the call. Also, the middleware check if the user has been verified, if not we warn him that its account is not verified yet.    
![Alt text](/Middleware-Design.png?raw=true "")  

# Things to improve
In the future, it would be better to incorporate a mechanism in order to let users create groups, these groups could be filled with other users by the creator and the only movies that users could see  
would be the movies contained in that group.  


# How to run the project:
More to come soon...  
I just need to change the endpoints and make them aim to localhost to help users test this app.
But node.js, express, mongodb and react will be necessary

# Design of the project:
![Alt text](/Design.png?raw=true "")  
This is a simplified design of the functionment of the web application, note that this design is subject to change.

# The project in images (still in development...)
Login Page:  
![Alt text](/Login-Page.png?raw=true "")  
This is the first page when you arrive on the website, here I added a few movies to test how they fill the page
![Alt text](/firstPage.png?raw=true "")
The format should look like that, we can't have more than 3 movies on a row, they will arrange themselves automatically
![Alt text](/MovieList.png?raw=true "")
Movie details overlay
![Alt text](/MovieDetails.png?raw=true "")
The add movie form:
![Alt text](/AddMovieForm.png?raw=true "")

