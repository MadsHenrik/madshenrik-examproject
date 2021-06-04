# madshenrik-examproject
Forum for e-sports team

# Frameworks used (for those not showing version, latest version is user)
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

# How to run the website:
Need two terminals, one for frontend and one for backend
Download the necessary framworks
frontend:
  go to the highfire-spa directory inside the frontend folder
  npm run dev
backend:
  go to the backend directory
  venv/scripts/activate
  py appserver.py

# Functions of the website:
-Creating posts
-Commenting on posts
-Liking/unliking posts
-Sorting posts (likes, comments, recent)
-Searching for posts based on headline
-Deleting posts
-Deleting comments
-Click on post to view entire post with comments and be able to like/commet/delete(if you created it)
-Register a new user
-Log in/log out
-Automatically routed to login if you try to do something that needs a valid user(create post/comment, like and so on)
