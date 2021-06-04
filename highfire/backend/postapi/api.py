"""
api.py
- provides the API endpoints for consuming and producing
  REST requests and responses
"""

from  functools import wraps
from datetime import  datetime, timedelta
from flask import Blueprint, jsonify, request,  current_app
from .models import db, Post, Comments,  User, Likes
import jwt

api = Blueprint('api', __name__)

#This function is used to check if the user that tries to  do something has a token
def token_required(f):
  @wraps(f)
  def _verify(*args, **kwargs):
    auth_headers = request.headers.get('Authorization', '').split()
    invalid = {
      'message': 'Invalid login. Log in or register',
      'authenticated': False
    }
    expired = {
      'message': 'Login has expired. Please log in again',
      'authenticated': False
    }

    if len(auth_headers) != 2:  #no login error
      return jsonify(invalid), 401

    try:
      token = auth_headers[1] #this is the token part of auth_headers
      token = token[1:len(token)-1] #remove "" from the token
      data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"]) #decode the token with the same algorithm used to create it
      user = User.query.filter_by(username=data['sub']).first()
      if not user:
        raise RuntimeError('User not found')
      return f(user, *args, **kwargs)
    except jwt.ExpiredSignatureError: #Token has expired
      return jsonify(expired), 401
    except  (jwt.InvalidTokenError, Exception) as e: #Token is invalid
      print(e)
      return jsonify(invalid), 401

  return _verify

@api.route('/posts/', methods=('GET', )) #get the posts that are not deleted from the database and return them as a dict
def fetch_posts():
    posts = Post.query.filter_by(deleted=False).all()
    return jsonify({ 'posts': [p.to_dict() for p in posts] })

@api.route('/posts/<int:id>/', methods=('GET', )) #get the post the user has routed to
def fetch_post(id):
    post = Post.query.filter_by(deleted=False,id=id).first()
    return jsonify({ 'post': post.to_dict() })

@api.route('/posts/', methods=('POST',)) #create a new post with the data that is sent in from the clientside
@token_required
def create_post(current_user): 
  data = request.get_json()
  post = Post(**data)
  post.creator = current_user #set the creator as the current user (found via token_required)
  db.session.add(post)
  db.session.commit()
  return jsonify(post.to_dict()), 201

@api.route('/register/', methods=('POST',)) #add a new user to the users table
def register():
  data = request.get_json()
  if(User.query.filter_by(username=data['username']).first()): #If the user already exists an error is returned
    return jsonify({'error': "Username must be unike"}), 401
  else:
    user = User(**data)
    db.session.add(user)
    db.session.commit()
    return jsonify(user.to_dict()), 201

@api.route('/login/',  methods=('POST',)) #Authenticate the user that tries to log in via the User.authenticate function
def login():
  data = request.get_json()
  user = User.authenticate(**data)

  if not user:
    return  jsonify({ 'message': 'Login failed', 'authenticated': False }), 401 #error if  login fails

  token = jwt.encode({ #create a token for this login session
    'sub': user.username,
    'iat': datetime.utcnow(), #when the token is created
    'exp': datetime.utcnow() + timedelta(minutes=30)}, #30 minutes from when the token is created it expires and a new token is needed for the functions that require a token
    current_app.config['SECRET_KEY'])
  return jsonify({ 
    'token': token.decode('UTF-8'),
    'user': user.to_dict()
    })

@api.route('/posts/', methods=('PUT', )) #This function is to like a post. The post table is updated, and if the user did not like the post before, a new entry is created in the Likes table
@token_required #To like a post you need to be logged in and have a valid token
def likePost(currentuser):
    done = 0
    postid = request.get_json()
    post = Post.query.get(postid)
    likes = Likes.query.all()
    for l in likes:
      like = l.to_dict()
      if (like['username'] == currentuser.username) and (str(like['post_id']) == postid) and like['liked']==1: #this is checks if the user already likes the post, and dislikes if it does
        post.likes = post.likes - 1
        thisLike = Likes.query.get(like['id'])
        thisLike.liked = 0 #sets liked to 0 so the user can like the post again
        done = 1 
      else:
        if (like['username'] == currentuser.username) and (str(like['post_id']) == postid): #likes the post if the user does not already like it
          thisLike = Likes.query.get(like['id'])
          thisLike.liked = 1
          post.likes = post.likes + 1
          done = 1
    if done == 0:
      newLike = Likes(currentuser.username, postid) #if the user has not interacted with the post before a new entry must be created in the Likes table
      post.likes = post.likes + 1
      db.session.add(newLike)
    db.session.commit()
    return jsonify({ 'post': post.to_dict() }), 201

@api.route('/comments/', methods=('POST',)) #this POST function creates a new entry in the comments table, witrh the postid as a foreign key
@token_required #To delete a post you need to be logged in and have a  valid token
def create_comment(currentUser):
  data = request.get_json()
  comment = Comments(**data)
  comment.user_name = currentUser.username #the user that created the comment is assigned (found in token_required)
  db.session.add(comment)
  db.session.commit()
  return jsonify(comment.to_dict()), 201

@api.route('/posts/<int:postid>/', methods=('PUT', )) #this PUT function sets post.deleted to True to simulate it being deleted (will not get fetched together with the others posts)
@token_required
def delete_post(currentuser, postid):
    post = Post.query.get(postid)
    post.deleted = True
    db.session.commit()
    return jsonify({ 'post': post.to_dict() })

@api.route('/comment/', methods=('PUT', )) #this PUT function sets comment.deleted to True to simulate is being deleted
@token_required #To delete a comment you need to be logged in and have a  valid token
def delete_comment(currentUser):
    commentId = request.get_json()
    comment = Comments.query.get(commentId)
    comment.deleted = True
    db.session.commit()
    return jsonify({ 'Comment': comment.to_dict() }), 201
