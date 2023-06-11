from flask import Blueprint, render_template, redirect, url_for

from .models import *
from .form import RegisterForm
from . import db

todo_bp = Blueprint("todo", __name__)


@todo_bp.route("/")
@todo_bp.route("/home")
def home_page():
    users = Users.query.all()
    return render_template("index.html", users=users)


@todo_bp.route("/login")
def login_page():
    return render_template("login.html")


@todo_bp.route("/register", methods=["GET", "POST"])
def register_page():
    form = RegisterForm()
    if form.validate_on_submit():
        user = Users(
            name=form.name.data,
            role=form.role.data,
            email=form.email.data,
            password_hash=form.password.data,
        )

        db.session.add(user)
        db.session.commit()

        return redirect(url_for("todo.login_page"))

    return render_template("register.html", form=form)


@todo_bp.route("/welcome")
def welcome_page():
    return render_template("welcome.html")


@todo_bp.route("/profile")
def profile_page():
    return render_template("profile.html")


@todo_bp.route("/test")
def test():
    return render_template("test.html")
