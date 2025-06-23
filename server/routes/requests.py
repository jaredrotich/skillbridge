from flask import Blueprint, request, jsonify
from models import db, SkillRequest, User, Skill

requests_bp = Blueprint("requests", __name__, url_prefix="/requests")


# GET all skill requests

@requests_bp.route("/", methods=["GET"])
def get_requests():
    return jsonify([r.to_dict() for r in SkillRequest.query.all()]), 200


# CREATE skill request

@requests_bp.route("/", methods=["POST"])
def create_request():
    data = request.get_json()
    requester_id = data.get("requester_id")
    skill_id = data.get("skill_id")

    if not User.query.get(requester_id):
        return {"error": "Requester not found"}, 404
    if not Skill.query.get(skill_id):
        return {"error": "Skill not found"}, 404

    try:
        new_request = SkillRequest(
            requester_id=requester_id,
            skill_id=skill_id,
            message=data.get("message", ""),
            status="pending"
        )
        db.session.add(new_request)
        db.session.commit()
        return new_request.to_dict(), 201
    except Exception as e:
        db.session.rollback()
        return {"error": str(e)}, 400


# UPDATE request status

@requests_bp.route("/<int:id>", methods=["PATCH"])
def update_status(id):
    req = SkillRequest.query.get_or_404(id)
    data = request.get_json()

    new_status = data.get("status")
    if new_status not in ["pending", "accepted", "declined"]:
        return {"error": "Invalid status"}, 400

    try:
        req.status = new_status
        db.session.commit()
        return req.to_dict(), 200
    except Exception as e:
        db.session.rollback()
        return {"error": str(e)}, 400
    
@requests_bp.route("/", methods=["POST"])
def create_request():
    data = request.get_json()
    user_id = session.get("user_id")
    
    if not user_id:
        return {"error": "Unauthorized"}, 401

    skill_id = data.get("skill_id")
    message = data.get("message")

    try:
        new_request = SkillRequest(
            requester_id=user_id,
            skill_id=skill_id,
            message=message
        )
        db.session.add(new_request)
        db.session.commit()
        return new_request.to_dict(), 201

    except Exception as e:
        db.session.rollback()
        return {"error": f"Failed to create request: {str(e)}"}, 500
