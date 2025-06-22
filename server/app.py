from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from config import Config

db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app)

    from models import User, Skill, SkillRequest

    @app.route('/')
    def home():
        return {"message": "Welcome to SkillBridge API 🎉"}

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
