from flask import Blueprint, request, jsonify
from models import db, Skill, User

skills_bp = Blueprint("skills", __name__, url_prefix="/skills")


# GET all skills

@skills_bp.route("/", methods=["GET"])
def get_skills():
    skills = Skill.query.all()
    return jsonify([s.to_dict() for s in skills]), 200

@skills_bp.route("/<int:id>", methods=["GET"])
def get_skill(id):
    skill = Skill.query.get(id)
    if not skill:
        return {"error": "Skill not found"}, 404
    return skill.to_dict(), 200




# CREATE new skill

@skills_bp.route("/", methods=["POST"])
def create_skill():
    data = request.get_json()
    user_id = data.get("user_id")
    
    if not User.query.get(user_id):
        return {"error": "User not found"}, 404

    try:
        new_skill = Skill(
            title=data["title"],
            description=data["description"],
            user_id=user_id
        )
        db.session.add(new_skill)
        db.session.commit()
        return new_skill.to_dict(), 201
    except Exception as e:
        db.session.rollback()
        return {"error": str(e)}, 400


# UPDATE skill

@skills_bp.route("/<int:id>", methods=["PATCH"])
def update_skill(id):
    skill = Skill.query.get_or_404(id)
    data = request.get_json()

    skill.title = data.get("title", skill.title)
    skill.description = data.get("description", skill.description)

    try:
        db.session.commit()
        return skill.to_dict(), 200
    except Exception as e:
        db.session.rollback()
        return {"error": str(e)}, 400


# DELETE skill

@skills_bp.route("/<int:id>", methods=["DELETE"])
def delete_skill(id):
    skill = Skill.query.get_or_404(id)

    try:
        db.session.delete(skill)
        db.session.commit()
        return {"message": "Skill deleted successfully"}, 200
    except Exception as e:
        db.session.rollback()
        return {"error": str(e)}, 400
    
