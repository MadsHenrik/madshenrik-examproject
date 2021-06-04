"""
models.py
- Data classes for the postapi application
"""

from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    posts = db.relationship('Post', backref="creator", lazy=False)

    def __init__(self, username, password):
        self.username = username
        self.password = generate_password_hash(password, method='sha256')

    @classmethod
    def authenticate(cls, **kwargs):
        username = kwargs.get('username')
        password = kwargs.get('password')
        
        if not username or not password:
            return None

        user = cls.query.filter_by(username=username).first()
        if not user or not check_password_hash(user.password, password):
            return None

        return user

    def to_dict(self):
        return dict(id=self.id, username=self.username)

class Likes(db.Model):
    __tabelname__ = 'likes'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), db.ForeignKey('users.username'))
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'))
    liked = db.Column(db.Integer)

    def __init__(self, username, post_id):
        self.username = username
        self.post_id = post_id
        self.liked = 1

    def to_dict(self):
        return dict(id=self.id,
                    username=self.username,
                    post_id=self.post_id,
                    liked=self.liked)

class Post(db.Model):
    __tablename__ = 'posts'

    id = db.Column(db.Integer, primary_key=True)
    headline = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    content = db.Column(db.String(1000))
    user_name =  db.Column(db.String(100), db.ForeignKey('users.username'))
    comments = db.relationship('Comments', backref="post", lazy=False)
    likes = db.Column(db.Integer, default=0)
    deleted = db.Column(db.Boolean, default=False)
    likeRel = db.relationship('Likes', backref="post", lazy=False)

    def __init__(self, headline, content):
        self.headline = headline
        self.content = content

    def to_dict(self):
        return dict(id=self.id,
                    headline=self.headline,
                    created_at=self.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                    content=self.content,
                    user_name=self.user_name,
                    comments=[comment.to_dict() for comment in self.comments],
                    likes=self.likes,
                    deleted=self.deleted,
                    likeRel=[like.to_dict() for like in self.likeRel],)

class Comments(db.Model):
    __tablename__ = 'comments'

    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'))
    user_name = db.Column(db.String(100), db.ForeignKey('users.username'))
    likes = db.Column(db.Integer, default=0)
    deleted = db.Column(db.Boolean, default=False)

    def __init__(self, text, post_id):
        self.text = text
        self.post_id = post_id
    
    def to_dict(self):
        return dict(id=self.id,
                    text=self.text,
                    created_at=self.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                    post_id=self.post_id,
                    user_name=self.user_name,
                    likes=self.likes,
                    deleted=self.deleted)
