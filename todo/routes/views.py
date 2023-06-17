from flask import Blueprint, render_template, request, redirect, url_for, flash
from flask_login import login_user, current_user, logout_user, login_required

from ..extensions import db
from ..models import *
from ..forms import *

views_bp = Blueprint("views", __name__)


@views_bp.route("/welcome", strict_slashes=False)
def welcome_page():
    return render_template("welcome.html")


@views_bp.route("/", methods=["GET", "POST"], strict_slashes=False)
@views_bp.route("/home", methods=["GET", "POST"], strict_slashes=False)
def home_page():
    if not current_user.is_authenticated:
        return render_template("landing.html")

    todo_form = TodoForm()
    todo_form.load_choices()
    project_form = ProjectForm()

    if request.method == "POST":
        if todo_form.validate_on_submit():
            todo = Todos(
                title=todo_form.todo_title.data,
                description=todo_form.todo_description.data,
                project_id=todo_form.project.data,
            )
            db.session.add(todo)

        elif project_form.validate_on_submit():
            project = Projects(
                title=project_form.project_title.data,
                description=project_form.project_description.data,
                user_id=current_user.user_id,
            )
            db.session.add(project)

        db.session.commit()
        return redirect(url_for("views.home_page"))

    return render_template("index.html", todo_form=todo_form, project_form=project_form)


@views_bp.route("/login", methods=["GET", "POST"], strict_slashes=False)
def login_page():
    form = LoginForm()

    if request.method == "POST":
        if form.validate_on_submit():
            email_registered = Users.query.filter_by(email=form.email.data).first()
            if email_registered and email_registered.password_auth(
                password_input=form.password.data
            ):
                login_user(email_registered, remember=True)
                flash(f"Welcome back, {email_registered.name}!", category="success")
                return redirect(url_for("views.home_page"))
            else:
                flash(
                    "Email and password are not match! Please try again.",
                    category="error",
                )

    return render_template("login.html", form=form)


@views_bp.route("/logout", strict_slashes=False)
def logout_page():
    logout_user()
    flash("You have been logged out!", category="info")

    return redirect(url_for("views.home_page"))


@views_bp.route("/register", methods=["GET", "POST"], strict_slashes=False)
def register_page():
    form = RegisterForm()
    if request.method == "POST":
        if form.validate_on_submit():
            user = Users(
                name=form.name.data,
                role=form.role.data,
                email=form.email.data,
                password=form.password.data,
            )

            db.session.add(user)
            db.session.commit()

            return redirect(url_for("views.login_page"))
        if form.errors != {}:
            for error in form.errors.values():
                flash(error)

    return render_template("register.html", form=form)


@views_bp.route("/profile", strict_slashes=False)
@login_required
def profile_page():
    return render_template("profile.html")
