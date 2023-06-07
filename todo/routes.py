from flask import Blueprint, render_template

todo_bp = Blueprint("todo", __name__)


@todo_bp.route("/")
@todo_bp.route("/home")
def home_page():
    return render_template("index.html")


@todo_bp.route("/login")
def login_page():
    return render_template("login.html")


@todo_bp.route("/register")
def register_page():
    return render_template("register.html")


@todo_bp.route("/welcome")
def welcome_page():
    return render_template("welcome.html")
