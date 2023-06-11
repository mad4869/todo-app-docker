from flask import Blueprint, render_template

from .models import *
from .form import RegisterForm

todo_bp = Blueprint("todo", __name__)


@todo_bp.route("/")
@todo_bp.route("/home")
def home_page():
    users = Users.query.all()
    return render_template("index.html", users=users)


@todo_bp.route("/login")
def login_page():
    return render_template("login.html")


@todo_bp.route("/register")
def register_page():
    form = RegisterForm()
    return render_template("register.html")


@todo_bp.route("/welcome")
def welcome_page():
    return render_template("welcome.html")


@todo_bp.route("/profile")
def profile_page():
    return render_template("profile.html")


@todo_bp.route("/test")
def test():
    return render_template("test.html")
