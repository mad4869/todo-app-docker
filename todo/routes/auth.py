from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
    get_jwt,
)

from ..extensions import db, jwt_manager
from ..models import Users, BlocklistToken
from ..forms import RegisterForm, LoginForm

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")


@auth_bp.route("/register", methods=["POST"], strict_slashes=False)
def register():
    form = RegisterForm(
        name=request.form["name"],
        role=request.form["role"],
        email=request.form["email"],
        password=request.form["password"],
        confirm_password=request.form["confirm_password"],
    )

    if form.validate():
        user = Users(
            name=form.name.data,
            role=form.role.data,
            email=form.email.data,
            password=form.password.data,
        )

        try:
            db.session.add(user)
            db.session.commit()
        except:
            db.session.rollback()

            return (
                jsonify({"success": False, "message": "Failed to register the user"}),
                500,
            )
        else:
            return (
                jsonify(
                    {
                        "success": True,
                        "message": "User registration is completed",
                        "data": user.serialize(),
                    }
                ),
                201,
            )
    if form.errors != {}:
        errors = [error for error in form.errors.values()]
        return jsonify({"success": False, "message": errors}), 400


@auth_bp.route("/login", methods=["POST"], strict_slashes=False)
def login():
    form = LoginForm(email=request.form["email"], password=request.form["password"])

    if form.validate():
        user_registered = db.session.execute(
            db.select(Users).filter_by(email=form.email.data)
        ).scalar_one_or_none()

        if not user_registered or not user_registered.password_auth(
            password_input=form.password.data
        ):
            return (
                jsonify({"success": False, "message": ["Email or password invalid!"]}),
                400,
            )

        access_token = create_access_token(identity=user_registered.user_id)
        refresh_token = create_refresh_token(identity=user_registered.user_id)

        return (
            jsonify(
                {
                    "success": True,
                    "message": "Login is successful!",
                    "access_token": access_token,
                    "refresh_token": refresh_token,
                }
            ),
            201,
        )
    if form.errors != {}:
        errors = list(form.errors.values())
        return jsonify({"success": False, "message": errors}), 400


@auth_bp.route("/refresh", methods=["POST"], strict_slashes=False)
@jwt_required(refresh=True)
def refresh_token():
    current_user = get_jwt_identity()

    access_token = {"access_token": create_access_token(identity=current_user)}

    return jsonify(access_token), 200


@auth_bp.route("/logout", methods=["POST"], strict_slashes=False)
@jwt_required()
def logout():
    jwt = get_jwt()
    jti = jwt.get("jti")

    token = BlocklistToken(jti=jti)

    try:
        db.session.add(token)
        db.session.commit()
    except:
        db.session.rollback()

        return jsonify({"success": True, "message": "Logout failed!"}), 500
    else:
        return jsonify({"success": True, "message": "Logout success!"}), 200


@jwt_manager.token_in_blocklist_loader
def check_if_token_is_revoked(jwt_header, jwt_payload: dict) -> bool:
    jti = jwt_payload["jti"]
    token = db.session.execute(
        db.select(BlocklistToken).filter_by(jti=jti)
    ).scalar_one_or_none()

    return token is not None
