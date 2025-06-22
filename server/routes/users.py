from flask import Blueprint, jsonify
from models import User

users_bp = Blueprint("users", __name__, url_prefix="/users")

@users_bp.route("/", methods=["GET"])
def get_users():
    return jsonify([user.to_dict() for user in User.query.all()])
