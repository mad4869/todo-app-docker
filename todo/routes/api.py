from flask import Blueprint, request, jsonify, flash, abort
from flask_jwt_extended import jwt_required, current_user
import json

from ..extensions import db, jwt_manager
from ..models import Users, Projects, Todos
from ..forms import AddTodoForm, AddProjectForm, EditTodoForm, EditProjectForm

api_bp = Blueprint("api", __name__, url_prefix="/api")


@jwt_manager.user_lookup_loader
def load_user(jwt_header, jwt_payload):
    """
    A function to get a logged in user data so it can be accessed from the 'current_user' object
    """
    identity = jwt_payload["sub"]
    user = db.session.execute(db.select(Users).filter_by(user_id=identity)).scalar_one()
    return user


@jwt_manager.unauthorized_loader
def unauthorized():
    return abort(401)


##### USERS ENDPOINTS #####


@api_bp.route("/users", methods=["GET"], strict_slashes=False)
@jwt_required()
def get_users():
    if current_user.role.upper() != "ADMIN":
        return jsonify({"success": False, "message": "Unauthorized action"}), 403

    users = db.session.execute(db.select(Users)).scalars()
    data = [user.serialize() for user in users]

    return jsonify({"success": True, "data": data}), 200


@api_bp.route("/users/<int:user_id>", methods=["GET", "PUT"], strict_slashes=False)
@jwt_required()
def access_user(user_id):
    if current_user.user_id != user_id and current_user.role.upper() != "ADMIN":
        return jsonify({"success": False, "message": "Unauthorized action"}), 403

    user = db.session.execute(db.select(Users).filter_by(user_id=user_id)).scalar_one()
    data = user.serialize()

    if request.method == "PUT":
        try:
            # updated_data = json.loads(request.get_data(as_text=True))
            updated_data = request.get_json()
            user.name = updated_data["name"]
            user.role = updated_data["role"]
            user.bio = updated_data["bio"]

            db.session.commit()
        except:
            db.session.rollback()

            flash("Failed to add the profile", category="error")

            return (
                jsonify({"success": False, "message": "Failed to update the profile"}),
                500,
            )
        else:
            updated_data = user.serialize()

            flash("Your profile has been updated", category="success")

            return jsonify({"success": True, "data": updated_data}), 201

    return jsonify({"success": True, "data": data}), 200


##### PROJECTS ENDPOINTS #####


@api_bp.route(
    "/users/<int:user_id>/projects", methods=["GET", "POST"], strict_slashes=False
)
@jwt_required()
def access_projects(user_id):
    if current_user.user_id != user_id and current_user.role.upper() != "ADMIN":
        return jsonify({"success": False, "message": "Unauthorized action"}), 403

    if request.method == "POST":
        form = AddProjectForm(
            title=request.form["title"], description=request.form["description"]
        )

        if form.validate():
            project = Projects(
                title=form.title.data,
                description=form.description.data,
                user_id=user_id,
            )

            try:
                db.session.add(project)
                db.session.commit()
            except:
                db.session.rollback()

                return (
                    jsonify({"success": False, "message": "Failed to add the project"}),
                    500,
                )
            else:
                return jsonify({"success": True, "data": project.serialize()}), 201
        if form.errors != {}:
            errors = [error for error in form.errors.values()]
            return jsonify({"success": False, "message": errors}), 400

    projects = db.session.execute(
        db.select(Projects).filter_by(user_id=user_id).order_by(Projects.project_id)
    ).scalars()
    data = [project.serialize() for project in projects]

    return jsonify({"success": True, "data": data}), 200


@api_bp.route(
    "/users/<int:user_id>/projects/<int:project_id>",
    methods=["GET", "PUT", "DELETE"],
    strict_slashes=False,
)
@jwt_required()
def access_project(user_id, project_id):
    if current_user.user_id != user_id and current_user.role.upper() != "ADMIN":
        return jsonify({"success": False, "message": "Unauthorized action"}), 403

    project = db.session.execute(
        db.select(Projects).filter_by(project_id=project_id)
    ).scalar_one()
    data = project.serialize()

    if request.method == "PUT":
        try:
            updated_data = request.get_json()
            project.title = updated_data["title"]
            project.description = updated_data["description"]

            db.session.commit()
        except:
            db.session.rollback()

            flash("Failed to update the project", category="error")

            return (
                jsonify({"success": False, "message": "Failed to update the project"}),
                500,
            )
        else:
            updated_data = project.serialize()

            flash(f"Your project has been updated!", category="success")

            return jsonify({"success": True, "data": updated_data}), 201

    elif request.method == "DELETE":
        try:
            db.session.delete(project)
            db.session.commit()
        except:
            db.session.rollback()

            flash("Failed to delete the project", category="error")

            return (
                jsonify({"success": False, "message": "Failed to delete the project"}),
                500,
            )
        else:
            flash(f"Your project has been deleted!", category="error")

            return (
                jsonify({"success": True, "message": "Your project has been deleted!"}),
                201,
            )

    return jsonify({"success": True, "data": data}), 200


##### TODOS ENDPOINTS #####


@api_bp.route(
    "/users/<int:user_id>/todos",
    methods=["GET", "POST"],
    strict_slashes=False,
)
@jwt_required()
def access_all_todos(user_id):
    if current_user.user_id != user_id and current_user.role.upper() != "ADMIN":
        return jsonify({"success": False, "message": "Unauthorized action"}), 403

    if request.method == "POST":
        form = AddTodoForm(
            project=request.form["project"],
            title=request.form["title"],
            description=request.form["description"],
        )
        form.load_choices(user_id)

        if form.validate():
            todo = Todos(
                title=form.title.data,
                description=form.description.data,
                project_id=form.project.data,
            )

            try:
                db.session.add(todo)
                db.session.commit()
            except:
                db.session.rollback()

                return (
                    jsonify({"success": False, "message": "Failed to add the task"}),
                    500,
                )
            else:
                return jsonify({"success": True, "data": todo.serialize()}), 201
        if form.errors != {}:
            errors = [error for error in form.errors.values()]
            return jsonify({"success": False, "message": errors}), 400

    todos = db.session.execute(
        db.select(Todos)
        .join(Projects, Todos.project_id == Projects.project_id)
        .filter(Projects.user_id == user_id)
        .filter(Todos.is_done == False)
        .order_by(Todos.todo_id)
    ).scalars()
    data = []
    for todo in todos:
        serial = todo.serialize()
        serial.update({"project_title": todo.projects.title})
        data.append(serial)

    return jsonify({"success": True, "data": data}), 200


@api_bp.route(
    "/users/<int:user_id>/projects/<int:project_id>/todos",
    methods=["GET"],
    strict_slashes=False,
)
@jwt_required()
def get_todos(user_id, project_id):
    if current_user.user_id != user_id and current_user.role.upper() != "ADMIN":
        return jsonify({"success": False, "message": "Unauthorized action"}), 403

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

    return jsonify({"success": True, "data": data}), 200


@api_bp.route(
    "/users/<int:user_id>/todos/<int:todo_id>",
    methods=["GET", "PUT", "DELETE"],
    strict_slashes=False,
)
@jwt_required()
def access_todo(user_id, todo_id):
    if current_user.user_id != user_id and current_user.role.upper() != "ADMIN":
        return jsonify({"success": False, "message": "Unauthorized action"}), 403

    todo = db.session.execute(
        db.select(Todos).filter(Todos.todo_id == todo_id)
    ).scalar_one()
    data = todo.serialize()

    if request.method == "PUT":
        try:
            updated_data = json.loads(request.get_data(as_text=True))
            todo.title = updated_data["title"]
            todo.description = updated_data["description"]
            todo.project_id = updated_data["project_id"]
            todo.is_done = updated_data["is_done"]

            db.session.commit()
        except:
            db.session.rollback()

            return (
                jsonify({"success": False, "message": "Failed to update the task"}),
                500,
            )
        else:
            updated_data = todo.serialize()

            return jsonify({"success": True, "data": updated_data}), 201

    elif request.method == "DELETE":
        try:
            db.session.delete(todo)
            db.session.commit()
        except:
            db.session.rollback()

            return (
                jsonify({"success": False, "message": "Failed to delete the task"}),
                500,
            )
        else:
            return (
                jsonify({"success": True, "message": "Your task has been deleted!"}),
                201,
            )

    return jsonify({"success": True, "data": data}), 200


##### DONES ENDPOINTS #####


@api_bp.route(
    "/users/<int:user_id>/dones",
    methods=["GET"],
    strict_slashes=False,
)
@jwt_required()
def get_all_dones(user_id):
    if current_user.user_id != user_id and current_user.role.upper() != "ADMIN":
        return jsonify({"success": False, "message": "Unauthorized action"}), 403

    dones = db.session.execute(
        db.select(Todos)
        .join(Projects, Todos.project_id == Projects.project_id)
        .filter(Projects.user_id == user_id)
        .filter(Todos.is_done == True)
        .order_by(Todos.todo_id)
    ).scalars()
    data = []
    for done in dones:
        serial = done.serialize()
        serial.update({"project_title": done.projects.title})
        data.append(serial)

    return jsonify({"success": True, "data": data}), 200


@api_bp.route(
    "/users/<int:user_id>/projects/<int:project_id>/dones",
    methods=["GET"],
    strict_slashes=False,
)
@jwt_required()
def get_dones(user_id, project_id):
    if current_user.user_id != user_id and current_user.role.upper() != "ADMIN":
        return jsonify({"success": False, "message": "Unauthorized action"}), 403

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

    return jsonify({"success": True, "data": data}), 200
