# MovieWebApp
This project will be at the end a web application in which you can add watched movies,  
you will also be able to rate these movies

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
On each CRUD routes of the api, I added a middleware responsible to check if the user that is trying to attempt a CRUD operation possess a token that we generated, if not we warn the user and ask him to log in again.  
If yes, then we proceed the call. Also, the middleware check if the user has been verified, if not we warn him that its account is not verified yet.    


# How to run the project:
More to come soon...

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

