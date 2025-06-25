from flask import Blueprint, request, jsonify, current_app
from models import db, SkillRequest, Skill, User
from flask_mail import Message

requests_bp = Blueprint("requests", __name__, url_prefix="/requests")


# -------------------------
# GET All Skill Requests
# -------------------------
@requests_bp.route("/", methods=["GET"])
def get_requests():
    try:
        requests = SkillRequest.query.all()
        return jsonify([r.to_dict() for r in requests]), 200
    except Exception as e:
        print("[REQUEST FETCH ERROR]", str(e))
        return {"error": "Failed to fetch requests"}, 500


# -------------------------
# CREATE New Skill Request
# -------------------------
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
        print("[REQUEST CREATE ERROR]", str(e))
        return {"error": "Failed to create request"}, 500


# -------------------------
# PATCH Update Status or Feedback
# -------------------------
@requests_bp.route("/<int:id>", methods=["PATCH"])
def update_request_status(id):
    request_obj = SkillRequest.query.get_or_404(id)
    data = request.get_json()

    if "status" in data:
        request_obj.status = data["status"]
    if "feedback" in data:
        request_obj.feedback = data["feedback"]

    try:
        db.session.commit()
        return request_obj.to_dict(), 200
    except Exception as e:
        db.session.rollback()
        return {"error": str(e)}, 400


# -------------------------
# CLIENT REQUEST → Email Admins
# -------------------------
@requests_bp.route("/client-request", methods=["POST"])
def client_request():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    message = data.get("message")

    if not all([name, email, message]):
        return {"error": "All fields are required."}, 400

    # Fetch admin emails
    admin_emails = [u.email for u in User.query.filter_by(is_admin=True).all()]
    if not admin_emails:
        return {"error": "No admin emails found."}, 404

    # Send mail
    try:
        mail = current_app.extensions.get("mail")
        if not mail:
            return {"error": "Mail service not configured."}, 500

        msg = Message(
            subject="🚨 New Client Service Request",
            sender=email,
            recipients=admin_emails,
            body=f"Name: {name}\nEmail: {email}\n\nMessage:\n{message}"
        )
        mail.send(msg)
        return {"message": "Request sent successfully."}, 200

    except Exception as e:
        print("[EMAIL ERROR]", str(e))
        return {"error": "Failed to send email"}, 500
