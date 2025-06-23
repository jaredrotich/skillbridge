from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from config import Config
from routes.skills import skills_bp
from routes.users import users_bp
from routes.requests import requests_bp

from models import db, User, Skill, SkillRequest

migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)

    #  Enable credentials for sessions!
    CORS(app, supports_credentials=True)

    app.register_blueprint(skills_bp)
    app.register_blueprint(users_bp)
    app.register_blueprint(requests_bp)

    @app.route('/users')
    def get_users():
        return [user.to_dict() for user in User.query.all()]

    @app.route('/')
    def home():
        return {"message": "Welcome to SkillBridge API 🎉"}

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
