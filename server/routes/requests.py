from flask import Blueprint, request, jsonify
from models import db, SkillRequest

requests_bp = Blueprint("requests", __name__, url_prefix="/requests")

@requests_bp.route("/", methods=["GET"])
def get_requests():
    return jsonify([r.to_dict() for r in SkillRequest.query.all()])

@requests_bp.route("/", methods=["POST"])
def create_request():
    data = request.get_json()
    try:
        new_request = SkillRequest(
            requester_id=data["requester_id"],
            skill_id=data["skill_id"],
            message=data["message"],
            status="pending"
        )
        db.session.add(new_request)
        db.session.commit()
        return new_request.to_dict(), 201
    except Exception as e:
        return {"error": str(e)}, 400

@requests_bp.route("/<int:id>", methods=["PATCH"])
def update_status(id):
    req = SkillRequest.query.get_or_404(id)
    data = request.get_json()

    if "status" in data:
        req.status = data["status"]
        db.session.commit()
        return req.to_dict(), 200
    return {"error": "No status provided"}, 400
