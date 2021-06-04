"""
models.py
- Data classes for the postapi application
"""

from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

#table to store users in
class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), unique=True, nullable=False) #unique username used to log in with
    password = db.Column(db.String(255), nullable=False)
    posts = db.relationship('Post', backref="creator", lazy=False) #posts that this user has created

    def __init__(self, username, password): #when creating a user we need username and password. At the beginning a user has 0 posts, and id is automatically generated
        self.username = username
        self.password = generate_password_hash(password, method='sha256')

    @classmethod #This function is used to verify that a user exists, and check if the password being typed in is the same as the one associated with the user
    def authenticate(cls, **kwargs):
        username = kwargs.get('username')
        password = kwargs.get('password')
        
        if not username or not password:
            return None

        user = cls.query.filter_by(username=username).first()
        if not user or not check_password_hash(user.password, password):
            return None

        return user

    def to_dict(self): #when user is to be sent, to_dict() is used to group id and username
        return dict(id=self.id, username=self.username)

#table for storing likes(used to check if a user has already liked a post)
class Likes(db.Model):
    __tabelname__ = 'likes'

    id = db.Column(db.Integer, primary_key=True) #automatically generated id
    username = db.Column(db.String(100), db.ForeignKey('users.username')) #relationship to the user table. This is the user that likes the post
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id')) #relationship to the post table. This is the post that the user likes
    liked = db.Column(db.Integer) #if this is set to 0, the like has been removed (the user unlikes a post)

    def __init__(self, username, post_id): #creating a new entry in the table needs username and the post being liked.
        self.username = username
        self.post_id = post_id
        self.liked = 1

    def to_dict(self):
        return dict(id=self.id,
                    username=self.username,
                    post_id=self.post_id,
                    liked=self.liked)

#table for storing posts
class Post(db.Model):
    __tablename__ = 'posts'

    id = db.Column(db.Integer, primary_key=True)
    headline = db.Column(db.Text) #title of the post
    created_at = db.Column(db.DateTime, default=datetime.utcnow) #when the post is created. datetime.utcnow is used to get the time at the moment the user creates a post
    content = db.Column(db.String(1000)) #The contents of the post
    user_name =  db.Column(db.String(100), db.ForeignKey('users.username')) #The user who created the post
    comments = db.relationship('Comments', backref="post", lazy=False) #the comments that are associated to the post
    likes = db.Column(db.Integer, default=0) #how many likes the post has
    deleted = db.Column(db.Boolean, default=False) #if the post is deleted
    likeRel = db.relationship('Likes', backref="post", lazy=False) #relationship with the Likes table used to check if a user has like this post

    def __init__(self, headline, content): 
        self.headline = headline
        self.content = content

    def to_dict(self): #The dicionary returned by this table (used to load posts, comments, likes) to frontend
        return dict(id=self.id,
                    headline=self.headline,
                    created_at=self.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                    content=self.content,
                    user_name=self.user_name,
                    comments=[comment.to_dict() for comment in self.comments],
                    likes=self.likes,
                    deleted=self.deleted,
                    likeRel=[like.to_dict() for like in self.likeRel],)

#Table for comments
class Comments(db.Model):
    __tablename__ = 'comments'

    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(500)) #The contents of the comment
    created_at = db.Column(db.DateTime, default=datetime.utcnow) #The time when the comment is created
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id')) #What post the comment belongs to
    user_name = db.Column(db.String(100), db.ForeignKey('users.username')) #The user who created the comment
    likes = db.Column(db.Integer, default=0) #Number of likes
    deleted = db.Column(db.Boolean, default=False) #If the comment is deleted

    def __init__(self, text, post_id): #creating a comment
        self.text = text
        self.post_id = post_id
    
    def to_dict(self): #The dict that gets returned to frontend
        return dict(id=self.id,
                    text=self.text,
                    created_at=self.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                    post_id=self.post_id,
                    user_name=self.user_name,
                    likes=self.likes,
                    deleted=self.deleted)
