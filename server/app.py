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

    db.init_app(app)
    migrate.init_app(app, db)

    #  Enable CORS with credentials (for session cookies to work!)
    CORS(app, supports_credentials=True)

    #  Register the blueprints
    app.register_blueprint(skills_bp)
    app.register_blueprint(users_bp)
    app.register_blueprint(requests_bp)

    #  Routes for testing
    @app.route('/users')
    def get_users():
        return jsonify([user.to_dict() for user in User.query.all()])

    @app.route('/')
    def home():
        return {"message": "Welcome to SkillBridge API 🎉"}

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
