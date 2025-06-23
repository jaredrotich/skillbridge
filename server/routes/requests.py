from flask import Blueprint, request, jsonify
from models import db, SkillRequest, Skill, User

requests_bp = Blueprint("requests", __name__, url_prefix="/requests")

# GET all skill requests
@requests_bp.route("/", methods=["GET"])
def get_requests():
    requests = SkillRequest.query.all()
    return jsonify([r.to_dict() for r in requests]), 200


# CREATE a new skill request
@requests_bp.route("/", methods=["POST"])
def create_request():
    data = request.get_json()

    requester_id = data.get("requester_id")
    skill_id = data.get("skill_id")
    message = data.get("message")

    if not all([requester_id, skill_id, message]):
        return {"error": "All fields are required"}, 400

    if not User.query.get(requester_id):
        return {"error": "Requester not found"}, 404
    if not Skill.query.get(skill_id):
        return {"error": "Skill not found"}, 404

    try:
        new_request = SkillRequest(
            requester_id=requester_id,
            skill_id=skill_id,
            message=message
        )
        db.session.add(new_request)
        db.session.commit()
        return new_request.to_dict(), 201
    except Exception as e:
        db.session.rollback()
        print(f"[REQUEST CREATE ERROR] {e}")
        return {"error": "Failed to create request"}, 500


# PATCH (update status)
@requests_bp.route("/<int:id>", methods=["PATCH"])
def update_request(id):
    data = request.get_json()
    req = SkillRequest.query.get(id)

    if not req:
        return {"error": "Request not found"}, 404

    if "status" in data:
        req.status = data["status"]

    try:
        db.session.commit()
        return req.to_dict(), 200
    except Exception as e:
        db.session.rollback()
        print(f"[REQUEST UPDATE ERROR] {e}")
        return {"error": "Failed to update request"}, 500
