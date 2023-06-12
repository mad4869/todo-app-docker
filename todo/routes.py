from flask import Blueprint, render_template, redirect, url_for, flash, jsonify

from flask_login import login_user, current_user, logout_user, login_required

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
@login_required
def profile_page():
    return render_template("profile.html")


@todo_bp.route("/users", methods=["GET"])
def get_users():
    users = db.session.execute(db.select(Users).order_by(Users.user_id)).scalars()
    users_list = []
    for user in users:
        user_dict = {
            "user_id": user.user_id,
            "name": user.name,
            "role": user.role,
            "email": user.email,
        }
        users_list.append(user_dict)

    return jsonify(users_list)


@todo_bp.route("/users/<int:user_id>", methods=["GET"])
def get_user(user_id):
    user = db.session.execute(db.select(Users).filter_by(user_id=user_id)).scalar_one()
    user_dict = {
        "user_id": user.user_id,
        "name": user.name,
        "role": user.role,
        "email": user.email,
    }

    return jsonify(user_dict)


@todo_bp.route("/projects", methods=["GET", "POST"])
def get_projects():
    projects = db.session.execute(
        db.select(Projects).order_by(Projects.project_id)
    ).scalars()
    projects_list = []
    for project in projects:
        project_dict = {
            "project_id": project.project_id,
            "title": project.title,
            "description": project.description,
            "user_id": project.user_id,
        }
        projects_list.append(project_dict)

    return jsonify(projects_list)


@todo_bp.route("/projects/<int:project_id>", methods=["GET"])
def get_project(project_id):
    project = db.session.execute(
        db.select(Projects).filter_by(project_id=project_id)
    ).scalar_one()
    project_dict = {
        "project_id": project.project_id,
        "title": project.title,
        "description": project.description,
        "user_id": project.user_id,
    }

    return jsonify(project_dict)


@todo_bp.route("/projects/<int:project_id>/todos", methods=["GET", "POST"])
def get_todos(project_id):
    todos = db.session.execute(
        db.select(Todos).filter_by(project_id=project_id).order_by(Todos.todo_id)
    ).scalars()
    todos_list = []
    for todo in todos:
        todo_dict = {
            "todo_id": todo.todo_id,
            "title": todo.title,
            "description": todo.description,
            "project_id": todo.project_id,
        }
        todos_list.append(todo_dict)

    return jsonify(todos_list)


@todo_bp.route("/projects/<int:project_id>/todos/<int:todo_id>", methods=["GET"])
def get_todo(project_id, todo_id):
    todo = db.session.execute(db.select(Todos).filter_by(todo_id=todo_id)).scalar_one()
    todo_dict = {
        "todo_id": todo.todo_id,
        "title": todo.title,
        "description": todo.description,
        "project_id": todo.project_id,
    }

    return jsonify(todo_dict)


@todo_bp.route("/projects/<int:project_id>/dones", methods=["GET", "POST"])
def get_dones(project_id):
    dones = db.session.execute(
        db.select(Dones)
        .join(Todos, Dones.todo_id == Todos.todo_id)
        .filter_by(project_id=project_id)
        .order_by(Todos.todo_id)
    ).scalars()
    dones_list = []
    for done in dones:
        done_dict = {
            "done_id": done.done_id,
            "title": done.title,
            "description": done.description,
            "project_id": done.project_id,
        }
        dones_list.append(done_dict)

    return jsonify(dones_list)


@todo_bp.route("/projects/<int:project_id>/dones/<int:done_id>", methods=["GET"])
def get_done(project_id, done_id):
    done = db.session.execute(db.select(Dones).filter_by(done_id=done_id)).scalar_one()
    done_dict = {
        "done_id": done.tdone_id,
        "title": done.title,
        "description": done.description,
        "todo_id": done.todo_id,
    }

    return jsonify(done_dict)
