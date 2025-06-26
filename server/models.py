from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import validates
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired
from flask import current_app
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False, unique=True)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password_hash = db.Column(db.String, nullable=False)
    is_admin = db.Column(db.Boolean, default=False)

    skills = db.relationship('Skill', backref='user', cascade="all, delete-orphan")
    requests_made = db.relationship(
        'SkillRequest',
        backref='requester',
        foreign_keys='SkillRequest.requester_id',
        cascade="all, delete-orphan"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "is_admin": self.is_admin
        }

    def generate_reset_token(self, expires_sec=1800):
        s = URLSafeTimedSerializer(current_app.config["SECRET_KEY"])
        return s.dumps(self.id)

    @staticmethod
    def verify_reset_token(token, expires_sec=1800):
        s = URLSafeTimedSerializer(current_app.config["SECRET_KEY"])
        try:
            user_id = s.loads(token, max_age=expires_sec)
        except (BadSignature, SignatureExpired):
            return None
        return User.query.get(user_id)

    @validates('email')
    def validate_email(self, key, email):
        if "@" not in email:
            raise ValueError("Invalid email format")
        return email


class Skill(db.Model):
    __tablename__ = 'skills'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    requests = db.relationship('SkillRequest', backref='skill', cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "user": self.user.to_dict() if self.user else None
        }


class SkillRequest(db.Model):
    __tablename__ = 'skill_requests'

    id = db.Column(db.Integer, primary_key=True)
    requester_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    skill_id = db.Column(db.Integer, db.ForeignKey('skills.id'), nullable=False)
    status = db.Column(db.String(20), default="pending")
    message = db.Column(db.String(255))
    feedback = db.Column(db.String(255))

    def to_dict(self):
        return {
            "id": self.id,
            "requester": self.requester.to_dict() if self.requester else None,
            "skill": self.skill.to_dict() if self.skill else None,
            "status": self.status,
            "message": self.message,
            "feedback": self.feedback
        }

    @validates('message')
    def validate_message(self, key, message):
        if message and len(message) > 255:
            raise ValueError("Message must be under 255 characters")
        return message


class Request(db.Model):
    __tablename__ = 'requests'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String)
    description = db.Column(db.Text)
    budget = db.Column(db.String)
    name = db.Column(db.String)
    email = db.Column(db.String)
    message = db.Column(db.Text)
    status = db.Column(db.String, default="pending")
    feedback = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    project_link = db.Column(db.String)


    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "budget": self.budget,
            "name": self.name,
            "email": self.email,
            "message": self.message,
            "status": self.status,
            "feedback": self.feedback,
            "created_at": self.created_at.isoformat(),
            "project_link": self.project_link

        }
