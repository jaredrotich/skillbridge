from flask import Blueprint, request, jsonify, current_app
from models import db, SkillRequest, Skill, User, Request
from flask_mail import Message

requests_bp = Blueprint("requests", __name__, url_prefix="/requests")


# === SKILL REQUESTS ===

@requests_bp.route("/", methods=["GET"])
def get_requests():
    try:
        skill_requests = SkillRequest.query.all()
        return jsonify([r.to_dict() for r in skill_requests]), 200
    except Exception as e:
        print("[REQUEST FETCH ERROR]", str(e))
        return {"error": "Failed to fetch requests"}, 500


@requests_bp.route("/", methods=["POST"])
def create_skill_request():
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


@requests_bp.route("/<int:id>", methods=["PATCH"])
def update_skill_request_status(id):
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


# === CLIENT DIRECT REQUEST ===

@requests_bp.route("/client-request", methods=["POST"])
def client_request():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    message = data.get("message")

    if not all([name, email, message]):
        return {"error": "All fields are required."}, 400

    try:
        # 1. Save to DB
        new_request = Request(
            name=name,
            email=email,
            message=message,
            title="Client Request",            
            description=message[:100],         
            budget="Not specified",            
            status="pending"
        )
        db.session.add(new_request)
        db.session.commit()

        # 2. Send Email to Admins
        admin_emails = [u.email for u in User.query.filter_by(is_admin=True).all()]
        if not admin_emails:
            return {"error": "No admin emails found."}, 404

        mail = current_app.extensions.get("mail")
        if not mail:
            return {"error": "Mail service not configured."}, 500

        msg = Message(
            subject="🚨 New Client Service Request",
            sender=email,
            recipients=admin_emails,
            body=f"""
New client service request received:

Name: {name}
Email: {email}

Message:
{message}
            """
        )
        mail.send(msg)

        # 3. Return saved request
        return jsonify(new_request.to_dict()), 201

    except Exception as e:
        db.session.rollback()
        import traceback
        traceback.print_exc()
        return {"error": "Failed to save and send request"}, 500
    
@requests_bp.route("/client", methods=["GET"])
def get_client_requests():
    try:
        client_requests = Request.query.order_by(Request.created_at.desc()).all()
        return jsonify([r.to_dict() for r in client_requests]), 200
    except Exception as e:
        print("[CLIENT REQUESTS FETCH ERROR]", str(e))
        return {"error": "Failed to fetch client requests"}, 500
    
@requests_bp.route("/completed", methods=["GET"])
def get_completed_projects():
    try:
        completed = Request.query.filter_by(status="completed").all()
        return jsonify([r.to_dict() for r in completed]), 200
    except Exception as e:
        print("[COMPLETED FETCH ERROR]", str(e))
        return {"error": "Failed to fetch completed projects"}, 500



@requests_bp.route("/requests", methods=["POST"])
def create_generic_request():
    data = request.get_json()

    new_request = Request(
        title=data.get("title"),
        description=data.get("description"),
        budget=data.get("budget"),
        type="project",
        status="pending"
    )
    db.session.add(new_request)
    db.session.commit()

    return jsonify(new_request.to_dict()), 201


@requests_bp.route("/requests/<int:id>", methods=["PATCH"])
def update_generic_request(id):
    req = Request.query.get(id)
    if not req:
        return jsonify({"error": "Request not found"}), 404

    data = request.get_json()
    if "status" in data:
        req.status = data["status"]
    if "feedback" in data:
        req.feedback = data["feedback"]
    if "project_link" in data:
        req.project_link = data["project_link"]


    db.session.commit()
    return jsonify(req.to_dict()), 200
