from flask import Flask, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from config import Config

from routes.skills import skills_bp
from routes.users import users_bp
from routes.requests import requests_bp

from models import db, User

migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    #  secret key for session management
    app.secret_key = "!<POTUS>"  #  enables Flask session usage

    #  Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)

    #  Enable CORS with credentials (important for session cookies)
    CORS(app, supports_credentials=True)

    #  Register blueprints
    app.register_blueprint(skills_bp)
    app.register_blueprint(users_bp)
    app.register_blueprint(requests_bp)

    #  Test route for users
    @app.route('/users')
    def get_users():
        return jsonify([user.to_dict() for user in User.query.all()])

    #  Root route
    @app.route('/')
    def home():
        return {"message": "Welcome to SkillBridge API 🎉"}

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
