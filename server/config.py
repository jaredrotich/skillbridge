import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
SECRET_KEY = "super-secret-key" 

class Config:
    SQLALCHEMY_DATABASE_URI = f"sqlite:///{os.path.join(BASE_DIR, 'app.db')}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
