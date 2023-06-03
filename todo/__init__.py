from flask import Flask
from flask_sqlalchemy import SQLAlchemy

from .routes import todo_bp

app = Flask(__name__)

app.config.from_pyfile("config.py")

app.register_blueprint(todo_bp)

db = SQLAlchemy(app)
