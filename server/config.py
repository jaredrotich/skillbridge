import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
SECRET_KEY = "super-secret-key" 

class Config:
    SQLALCHEMY_DATABASE_URI = f"sqlite:///{os.path.join(BASE_DIR, 'app.db')}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = 'jaredrotich3@gmail.com'
    MAIL_PASSWORD = 'qbed hxhm lkqj hyiq'
    MAIL_DEFAULT_SENDER = 'jaredrotich3@gmail.com'
    