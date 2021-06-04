# madshenrik-examproject
Forum for e-sports team

## Frameworks used (for those not showing version, latest version is user)
*Flask 1.1.2

*Flask-SQLAlchemy 

*Flask-Migrate 2.7.0

*Flask-Script 

*requests

*Vue.js (vue-cli)

*Bootstrap 4.6.x

*vuex

*Flask-CORS

*PyJWT

## How to run the website:
Download the necessary framworks
  
Backend:

  -In a second terminal in the backendfolder type ```venv/scripts/activate``` followed by ```py appserver.py```  to start the app
  
Frontend: 

  -In one terminal in the highfire-spa folder ```run npm run dev``` command
  

## Functions of the website:
-Click on post to view entire post to view the entire content (if the content string is not to long it will also show the entire string on the homepage) as well as comments, a button for adding likes, and the ability to add comments.

-Creating posts. A logged in user can create a new post, which will be added to the database. 

-Commenting on posts. A logged in user can create a comment on a post, which will be added to the database

-Liking/unliking posts. A logged in user can like a post. If the user has already like the post, the user is given the option to unlike it.

-Sorting posts (likes, comments, recent). On the homescreen where all posts are  shown there is a selectionbox in which the user can select what way to sort the posts. The options are: recent(newest first), likes(most likes first) and comments(most comments first). The preference of how to sort is saved in localstorage, so the posts stay sorted when the user revisits the page.

-Searching for posts based on headline. On the homescreen there is also a searchbar in which the user can type in searchwords. All posts containing the searchword are shown, whilst the rest are filtered out.

-Deleting posts. When a user is logged in and visiting its own post there is a button which allows for the user to delete the post. This sets the "deleted" column of the database to true (1). Deleted posts will no longer be shown on the homescreen.

-Deleting comments. When a user is logged in and viewing a post on which the user has commented, the comments the user has created has a delete button which allows the user to delete the comment, similarly to how a user can delete its own posts.

-Register a new user. On /register the option to create a new user is given. To create a user, the server needs a password and a username. The username must be unique.

-Log in/log out. On the navbar there is a dropdown menu which either shows login and register, or log out, depending on if the user is signed in or not. Log in takes the user to the login page where it can log in. When the user is logged in it is given a jwt token in localstorage. This token is necessary for doing stuff like posting post, liking posts, commenting on posts as well as deleting posts and comments. When the user is logged in log out is shown instead of login and register. This button deletes the users token from localstorage.

-Automatically routed to login if you try to do something that needs a valid user. The token in localstorage will be deleted (if it is there), as it has either expired or is invalid. 
