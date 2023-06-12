from flask import Blueprint, render_template, redirect, url_for, flash

from flask_login import login_user, current_user, logout_user

from . import db
from .models import *
from .form import *

todo_bp = Blueprint("todo", __name__)


@todo_bp.route("/")
@todo_bp.route("/home")
def home_page():
    return render_template("index.html")


@todo_bp.route("/login", methods=["GET", "POST"])
def login_page():
    form = LoginForm()
    if form.validate_on_submit():
        email_registered = Users.query.filter_by(email=form.email.data).first()
        print(email_registered)
        if email_registered and email_registered.password_auth(
            password_input=form.password.data
        ):
            login_user(email_registered)
            flash(f"Welcome back, {email_registered.name}!")
            return redirect(url_for("todo.home_page"))
        else:
            flash("Email and password are not match! Please try again.")
    return render_template("login.html", form=form)


@todo_bp.route("/logout")
def logout_page():
    logout_user()
    flash("You have been logged out!")

    return redirect(url_for("todo.home_page"))


@todo_bp.route("/register", methods=["GET", "POST"])
def register_page():
    form = RegisterForm()
    if form.validate_on_submit():
        user = Users(
            name=form.name.data,
            role=form.role.data,
            email=form.email.data,
            password=form.password.data,
        )

        db.session.add(user)
        db.session.commit()

        return redirect(url_for("todo.login_page"))
    if form.errors != {}:
        for error in form.errors.values():
            flash(error)

    return render_template("register.html", form=form)


@todo_bp.route("/welcome")
def welcome_page():
    return render_template("welcome.html")


@todo_bp.route("/profile")
def profile_page():
    return render_template("profile.html")
