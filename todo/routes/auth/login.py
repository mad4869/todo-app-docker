from flask import request, jsonify, flash
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
)
from flask_login import login_user

from . import auth_bp, check_if_token_is_revoked
from ...extensions import db
from ...models import Users
from ...forms import LoginForm


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

        login_user(user_registered)

        access_token = create_access_token(identity=user_registered.user_id)
        refresh_token = create_refresh_token(identity=user_registered.user_id)

        flash(
            f"Login successful. Welcome back, {user_registered.name}!",
            category="hello",
        )
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
