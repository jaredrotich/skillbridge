from flask import Blueprint, jsonify, session, request, current_app
from models import db, User
from sqlalchemy.exc import IntegrityError
from werkzeug.security import generate_password_hash, check_password_hash
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired

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
        print(f"[SIGNUP ERROR] {str(e)}")
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


# -------------------------
# HELPER: Generate Token
# -------------------------
def generate_reset_token(email):
    s = URLSafeTimedSerializer(current_app.config["SECRET_KEY"])
    return s.dumps(email, salt="password-reset")


def verify_reset_token(token, expiration=3600):
    s = URLSafeTimedSerializer(current_app.config["SECRET_KEY"])
    try:
        email = s.loads(token, salt="password-reset", max_age=expiration)
        return User.query.filter_by(email=email).first()
    except (BadSignature, SignatureExpired):
        return None


# -------------------------
# FORGOT PASSWORD
# -------------------------
@users_bp.route("/forgot_password", methods=["POST"])
def forgot_password():
    data = request.get_json()
    email = data.get("email")
    user = User.query.filter_by(email=email).first()

    if not user:
        return {"error": "Email not found"}, 404

    token = generate_reset_token(email)
    reset_link = f"http://localhost:3000/reset-password/{token}"
    print(f"[RESET LINK] {reset_link}")  # In production, send via email

    return {"message": "Reset link generated", "reset_link": reset_link}, 200


# -------------------------
# RESET PASSWORD
# -------------------------
@users_bp.route("/reset_password/<token>", methods=["POST"])
def reset_password(token):
    user = verify_reset_token(token)

    if not user:
        return {"error": "Invalid or expired token"}, 400

    data = request.get_json()
    new_password = data.get("password")
    if not new_password:
        return {"error": "Password is required"}, 400

    user.password_hash = generate_password_hash(new_password)
    db.session.commit()
    return {"message": "Password has been reset"}, 200
