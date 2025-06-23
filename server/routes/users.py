from flask import Blueprint, jsonify
from flask import session, request

from models import User

users_bp = Blueprint("users", __name__, url_prefix="/users")

@users_bp.route("/", methods=["GET"])
def get_users():
    return jsonify([user.to_dict() for user in User.query.all()])


@users_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data["username"]).first()
    if user and user.password_hash == data["password"]:  # (use hashed comparison in production)
        session["user_id"] = user.id
        return user.to_dict(), 200
    return {"error": "Invalid credentials"}, 401

@users_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    new_user = User(
        username=data["username"],
        email=data["email"],
        password_hash=data["password"]
    )
    db.session.add(new_user)
    db.session.commit()
    session["user_id"] = new_user.id
    return new_user.to_dict(), 201

@users_bp.route("/check_session", methods=["GET"])
def check_session():
    user_id = session.get("user_id")
    if user_id:
        user = User.query.get(user_id)
        return user.to_dict()
    return {"error": "Unauthorized"}, 401

@users_bp.route("/logout", methods=["DELETE"])
def logout():
    session.pop("user_id", None)
    return {"message": "Logged out successfully"}, 200
