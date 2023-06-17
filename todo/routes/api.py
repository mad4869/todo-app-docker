from flask import Blueprint, jsonify

from ..extensions import db
from ..models import *

api_bp = Blueprint("api", __name__, url_prefix="/api")


@api_bp.route("/users", methods=["GET"], strict_slashes=False)
def get_users():
    users = db.session.execute(db.select(Users).order_by(Users.user_id)).scalars()
    data = [user.serialize() for user in users]

    return jsonify(data)


@api_bp.route("/users/<int:user_id>", methods=["GET"], strict_slashes=False)
def get_user(user_id):
    user = db.session.execute(db.select(Users).filter_by(user_id=user_id)).scalar_one()
    data = user.serialize()

    return jsonify(data)


@api_bp.route("/users/<int:user_id>/projects", methods=["GET"], strict_slashes=False)
def get_projects(user_id):
    projects = db.session.execute(
        db.select(Projects).filter_by(user_id=user_id).order_by(Projects.project_id)
    ).scalars()
    data = [project.serialize() for project in projects]

    return jsonify(data)


@api_bp.route("/projects/<int:project_id>", methods=["GET"], strict_slashes=False)
def get_project(project_id):
    project = db.session.execute(
        db.select(Projects).filter_by(project_id=project_id)
    ).scalar_one()
    data = project.serialize()

    return jsonify(data)


@api_bp.route(
    "/users/<int:user_id>/todos",
    methods=["GET"],
    strict_slashes=False,
)
def get_all_todos(user_id):
    todos = db.session.execute(
        db.select(Todos)
        .join(Projects, Todos.project_id == Projects.project_id)
        .filter(Projects.user_id == user_id)
        .order_by(Todos.todo_id)
    ).scalars()
    data = []
    for todo in todos:
        serial = todo.serialize()
        serial.update({"project_title": todo.projects.title})
        data.append(serial)

    return jsonify(data)


@api_bp.route(
    "/users/<int:user_id>/projects/<int:project_id>/todos",
    methods=["GET"],
    strict_slashes=False,
)
def get_todos(user_id, project_id):
    todos = db.session.execute(
        db.select(Todos)
        .join(Projects, Todos.project_id == Projects.project_id)
        .filter(Projects.user_id == user_id, Todos.project_id == project_id)
        .order_by(Todos.todo_id)
    ).scalars()
    data = []
    for todo in todos:
        serial = todo.serialize()
        serial.update({"project_title": todo.projects.title})
        data.append(serial)

    return jsonify(data)


@api_bp.route("/todos/<int:todo_id>", methods=["GET"], strict_slashes=False)
def get_todo(todo_id):
    todo = db.session.execute(
        db.select(Todos).filter(Todos.todo_id == todo_id)
    ).scalar_one()
    data = todo.serialize()

    return jsonify(data)


@api_bp.route(
    "/users/<int:user_id>/dones",
    methods=["GET"],
    strict_slashes=False,
)
def get_all_dones(user_id):
    dones = db.session.execute(
        db.select(Todos)
        .join(Projects, Todos.project_id == Projects.project_id)
        .filter(Todos.is_done == True)
        .order_by(Todos.todo_id)
    ).scalars()
    data = []
    for done in dones:
        serial = done.serialize()
        serial.update({"project_title": done.projects.title})
        data.append(serial)

    return jsonify(data)


@api_bp.route(
    "/users/<int:user_id>/projects/<int:project_id>/dones",
    methods=["GET"],
    strict_slashes=False,
)
def get_dones(user_id, project_id):
    dones = db.session.execute(
        db.select(Todos)
        .join(Projects, Todos.project_id == Projects.project_id)
        .filter(
            Projects.user_id == user_id,
            Todos.project_id == project_id,
            Todos.is_done == True,
        )
        .order_by(Todos.todo_id)
    ).scalars()
    data = []
    for done in dones:
        serial = done.serialize()
        serial.update({"project_title": done.projects.title})
        data.append(serial)

    return jsonify(data)
