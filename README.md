# skillbridge

SkillBridge is a full-stack web application designed to connect freelancers with clients efficiently. It allows users to create profiles, showcase skills, post jobs, send requests, and manage freelance tasks through a clean and secure interface.

##  Technologies Used

### Backend
- Python  (Flask)
- Flask SQLAlchemy ORM
- Flask-Migrate
- Flask-CORS
- Flask-Mail
- SQLite (development) / PostgreSQL (production-ready)

### Frontend
- React  (with Vite)
- React Router
- Axios
- Formik & Yup for form handling and validation
- Tailwind and CSS for clean, responsive UI

---


##  Features

-  **User Authentication** (Sign Up / Sign In)
-  **Freelancer & Client Profiles**
-  **Skill Management** – Add, view, and update your skills
-  **Client Requests** – Post freelance jobs, receive and review proposals
-  **Email Notifications** (using Flask-Mail)
-  Fully CORS-enabled for seamless frontend-backend integration

 
 # Folder structure
 skillbridge/
├── client/                  # React Frontend
│   ├── src/
│   │   ├── components/      # Navbar, Forms, 
│   │   ├── pages/           # Skills, Requests, UsersList, .
│   │   └── App.js
│   └── package.json
│
└── server/                  # Flask Backend
    ├── models.py
    ├── routes/              # skills.py, users.py, requests.py
    ├── app.py
    ├── config.py
    └── requirements.txt

# Cloning repository
git clone https://github.com/yourusername/skillbridge.git
cd skillbridge


# Back end set-up
cd server
python3 -m venv venv
pip install pipenv, pipenv install, 
pipenv shell
pip install -r requirements.txt
flask db init
flask db migrate -m "Initial"
flask db upgrade

flask run

# FRont end set up
cd client
npm install
npm run dev


# Email configuration
MAIL_SERVER = 'smtp.gmail.com'
MAIL_PORT = 587
MAIL_USE_TLS = True
MAIL_USERNAME = 'your.email@gmail.com'
MAIL_PASSWORD = 'your_app_password'
MAIL_DEFAULT_SENDER = 'your.email@gmail.com'

#