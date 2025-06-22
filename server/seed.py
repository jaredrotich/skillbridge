from app import create_app, db
from models import User, Skill, SkillRequest

app = create_app()
app.app_context().push()

# Wipe existing
db.drop_all()
db.create_all()

# Create users
u1 = User(username="james", email="james@mail.com", password_hash="hashed")
u2 = User(username="rose", email="rose@mail.com", password_hash="hashed")

# Create skills
s1 = Skill(title="Video Editing", description="I use Premiere Pro", user=u1)
s2 = Skill(title="Python Tutoring", description="I'll teach you from basics", user=u2)

# Requests
r1 = SkillRequest(skill=s2, requester=u1, message="I'd love a Python session")

# Add and commit
db.session.add_all([u1, u2, s1, s2, r1])
db.session.commit()

print("✅ Seeded data successfully!")
