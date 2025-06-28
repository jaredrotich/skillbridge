from flask import Flask, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from flask_mail import Mail, Message

from config import Config
from models import db, User
from routes.skills import skills_bp
from routes.users import users_bp
from routes.requests import requests_bp

migrate = Migrate()
mail = Mail()

def send_service_request_email(to_email, subject, body):
    msg = Message(subject=subject, recipients=[to_email])
    msg.body = body
    try:
        mail.send(msg)
    except Exception as e:
        print("[EMAIL ERROR]", e)

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    app.secret_key = "!<POTUS>"

   
    db.init_app(app)
    migrate.init_app(app, db)
    mail.init_app(app)
    CORS(app, supports_credentials=True)

   
    app.register_blueprint(skills_bp)
    app.register_blueprint(users_bp)
    app.register_blueprint(requests_bp)

   
    @app.route('/users')
    def get_users():
        users = User.query.all()
        return jsonify([user.to_dict() for user in users])

    @app.route('/')
    def home():
        return {"message": "Welcome to SkillBridge API 🎉"}

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
