from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import validates

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False, unique=True)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password_hash = db.Column(db.String, nullable=False)

    skills = db.relationship('Skill', backref='user', cascade="all, delete")
    requests_made = db.relationship(
        'SkillRequest', 
        backref='requester', 
        foreign_keys='SkillRequest.requester_id'
    )

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email
        }

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
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    requests = db.relationship('SkillRequest', backref='skill', cascade="all, delete")

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            #  Safe check added to avoid NoneType error
            "user": self.user.to_dict() if self.user else None
        }


class SkillRequest(db.Model):
    __tablename__ = 'skill_requests'

    id = db.Column(db.Integer, primary_key=True)
    requester_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    skill_id = db.Column(db.Integer, db.ForeignKey('skills.id'))
    status = db.Column(db.String(20), default="pending") 
    message = db.Column(db.String(255))

    def to_dict(self):
        return {
            "id": self.id,
            #  Avoid crashes if any foreign key is missing
            "requester": self.requester.to_dict() if self.requester else None,
            "skill": self.skill.to_dict() if self.skill else None,
            "status": self.status,
            "message": self.message
        }

    @validates('message')
    def validate_message(self, key, message):
        if len(message) > 255:
            raise ValueError("Message must be under 255 characters")
        return message
