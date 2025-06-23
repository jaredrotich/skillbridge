from flask import Blueprint, jsonify, session, request
from models import db, User
from sqlalchemy.exc import IntegrityError
from werkzeug.security import generate_password_hash, check_password_hash

users_bp = Blueprint("users", __name__, url_prefix="/users")

# -------------------------
# GET All Users
# -------------------------
@users_bp.route("/", methods=["GET"])
def get_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users]), 200

# -------------------------
# LOGIN
# -------------------------
@users_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data["username"]).first()

    if user and check_password_hash(user.password_hash, data["password"]):
        session["user_id"] = user.id
        return user.to_dict(), 200

    return {"error": "Invalid credentials"}, 401

# -------------------------
# SIGNUP
# -------------------------
@users_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not all([username, email, password]):
        return {"error": "All fields are required."}, 400

    try:
        hashed_pw = generate_password_hash(password)
        new_user = User(username=username, email=email, password_hash=hashed_pw)
        db.session.add(new_user)
        db.session.commit()
        session["user_id"] = new_user.id
        return new_user.to_dict(), 201

    except IntegrityError:
        db.session.rollback()
        return {"error": "Username or email already taken."}, 409

    except Exception as e:
        db.session.rollback()
        print(f"[SIGNUP ERROR] {str(e)}")  # This prints the exact problem!
        return {"error": f"Signup failed. Reason: {str(e)}"}, 500

# -------------------------
# CHECK SESSION
# -------------------------
@users_bp.route("/check_session", methods=["GET"])
def check_session():
    user_id = session.get("user_id")
    if user_id:
        user = User.query.get(user_id)
        if user:
            return user.to_dict(), 200
    return {"error": "Unauthorized"}, 401

# -------------------------
# LOGOUT
# -------------------------
@users_bp.route("/logout", methods=["DELETE"])
def logout():
    session.pop("user_id", None)
    return {"message": "Logged out successfully"}, 200
