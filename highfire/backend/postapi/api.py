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

def token_required(f):
  @wraps(f)
  def _verify(*args, **kwargs):
    auth_headers = request.headers.get('Authorization', '').split()
    #print(auth_headers)
    invalid = {
      'message': 'Invalid login. Log in or register',
      'authenticated': False
    }
    expired = {
      'message': 'Login has expired. Please log in again',
      'authenticated': False
    }

    if len(auth_headers) != 2:
      return jsonify(invalid), 401

    try:
      token = auth_headers[1]
      token = token[1:len(token)-1]
      data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
      user = User.query.filter_by(username=data['sub']).first()
      if not user:
        raise RuntimeError('User not found')
      return f(user, *args, **kwargs)
    except jwt.ExpiredSignatureError:
      return jsonify(expired), 401
    except  (jwt.InvalidTokenError, Exception) as e:
      print(e)
      return jsonify(invalid), 401

  return _verify

@api.route('/posts/', methods=('GET', ))
def fetch_posts():
    posts = Post.query.filter_by(deleted=False).all()
    return jsonify({ 'posts': [p.to_dict() for p in posts] })

@api.route('/posts/<int:id>/', methods=('GET', ))
def fetch_post(id):
    post = Post.query.get(id)
    return jsonify({ 'post': post.to_dict() })

@api.route('/posts/', methods=('POST',))
@token_required
def create_post(current_user): #no får dinna inn name og content men den bruka data så
  data = request.get_json()
  post = Post(**data)
  post.creator = current_user
  db.session.add(post)
  db.session.commit()
  return jsonify(post.to_dict()), 201

@api.route('/register/', methods=('POST',))
def register():
  data = request.get_json()
  if(User.query.filter_by(username=data['username']).first()):
    return jsonify({'error': "Username must be unike"}), 401
  else:
    user = User(**data)
    db.session.add(user)
    db.session.commit()
    return jsonify(user.to_dict()), 201

@api.route('/login/',  methods=('POST',))
def login():
  data = request.get_json()
  user = User.authenticate(**data)

  if not user:
    return  jsonify({ 'message': 'Login failed', 'authenticated': False }), 401

  token = jwt.encode({
    'sub': user.username,
    'iat': datetime.utcnow(),
    'exp': datetime.utcnow() + timedelta(minutes=30)},
    current_app.config['SECRET_KEY'])
  return jsonify({ 
    'token': token.decode('UTF-8'),
    'user': user.to_dict()
    })

@api.route('/posts/', methods=('PUT', ))
@token_required
def likePost(currentuser):
    done = 0
    postid = request.get_json()
    post = Post.query.get(postid)
    likes = Likes.query.all()
    for l in likes:
      like = l.to_dict()
      if (like['username'] == currentuser.username) and (str(like['post_id']) == postid) and like['liked']==1:
        post.likes = post.likes - 1
        thisLike = Likes.query.get(like['id'])
        thisLike.liked = 0
        done = 1
      else:
        if (like['username'] == currentuser.username) and (str(like['post_id']) == postid):
          thisLike = Likes.query.get(like['id'])
          thisLike.liked = 1
          post.likes = post.likes + 1
          done = 1
    if done == 0:
      newLike = Likes(currentuser.username, postid)
      post.likes = post.likes + 1
      db.session.add(newLike)
    db.session.commit()
    return jsonify({ 'post': post.to_dict() }), 201

@api.route('/comments/', methods=('POST',))
@token_required
def create_comment(currentUser):
  data = request.get_json()
  comment = Comments(**data)
  comment.user_name = currentUser.username
  db.session.add(comment)
  db.session.commit()
  return jsonify(comment.to_dict()), 201

@api.route('/posts/<int:postid>/', methods=('PUT', ))
@token_required
def delete_post(currentuser, postid):
    post = Post.query.get(postid)
    post.deleted = True
    db.session.commit()
    return jsonify({ 'post': post.to_dict() })

@api.route('/comment/', methods=('PUT', ))
@token_required
def delete_comment(currentUser):
    commentId = request.get_json()
    comment = Comments.query.get(commentId)
    comment.deleted = True
    db.session.commit()
    return jsonify({ 'Comment': comment.to_dict() }), 201
