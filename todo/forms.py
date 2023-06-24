from flask import current_app
from flask_wtf import FlaskForm
from wtforms import (
    HiddenField,
    StringField,
    PasswordField,
    SubmitField,
    TextAreaField,
    SelectField,
    ValidationError,
)
from wtforms.validators import InputRequired, DataRequired, Length, Email, EqualTo

from .models import *


class RegisterForm(FlaskForm):
    def validate_email(self, email_input):
        email_exists = Users.query.filter_by(email=email_input.data).first()
        if email_exists:
            raise ValidationError(
                "Email address already registered! Please login or use a different one"
            )

    name = StringField(
        "Name",
        validators=[Length(min=1, max=50), InputRequired()],
        id="form-register-name",
    )
    role = StringField(
        "Role",
        validators=[Length(min=1, max=50), InputRequired()],
        id="form-register-role",
    )
    email = StringField(
        "Email",
        validators=[Length(min=1, max=50), InputRequired(), Email()],
        id="form-register-email",
    )
    password = PasswordField(
        "Password",
        validators=[Length(min=6, max=100), InputRequired()],
        id="form-register-password",
    )
    confirm_password = PasswordField(
        "Confirm Password",
        validators=[EqualTo("password", "The passwords do not match"), InputRequired()],
        id="form-register-confirm-password",
    )
    submit = SubmitField("CREATE ACCOUNT", id="form-register-submit")


class LoginForm(FlaskForm):
    email = StringField(
        "Email",
        validators=[Length(min=1, max=50), InputRequired(), Email()],
        id="form-login-email",
    )
    password = PasswordField(
        "Password",
        validators=[Length(min=6, max=100), InputRequired()],
        id="form-login-password",
    )
    submit = SubmitField("LOGIN", id="form-login-submit")


class AddProjectForm(FlaskForm):
    title = StringField(
        "Title",
        validators=[Length(min=1, max=100), InputRequired()],
        id="form-add-project-title",
    )
    description = TextAreaField(
        "Description", validators=[Length(max=250)], id="form-add-project-description"
    )
    submit = SubmitField("ADD", id="form-add-project-submit")


class EditProjectForm(FlaskForm):
    put_method = HiddenField(name="_method", default="PUT")
    project_id = HiddenField(id="form-edit-project-id")
    title = StringField(
        "Title",
        validators=[Length(min=1, max=100), InputRequired()],
        id="form-edit-project-title",
    )
    description = TextAreaField(
        "Description",
        validators=[Length(max=250)],
        id="form-edit-project-description",
    )
    submit = SubmitField("UPDATE", id="form-edit-project-submit")


class AddTodoForm(FlaskForm):
    project = SelectField(
        "Choose project:",
        coerce=int,
        validators=[DataRequired()],
        id="form-add-todo-project",
    )
    title = StringField(
        "Title",
        validators=[Length(min=1, max=100), InputRequired()],
        id="form-add-todo-title",
    )
    description = TextAreaField(
        "Description", validators=[Length(max=250)], id="form-add-todo-description"
    )
    submit = SubmitField("ADD", id="form-add-todo-submit")

    def load_choices(self, user_id):
        with current_app.app_context():
            projects = Projects.query.filter(Projects.user_id == user_id)
            self.project.choices = [
                (project.project_id, project.title) for project in projects
            ]


class EditTodoForm(FlaskForm):
    put_method = HiddenField(name="_method", default="PUT")
    todo_id = HiddenField(id="form-edit-todo-id")
    project = SelectField(
        "Choose project:",
        coerce=int,
        validators=[DataRequired()],
        id="form-edit-todo-project",
    )
    title = StringField(
        "Title",
        validators=[Length(min=1, max=100), InputRequired()],
        id="form-edit-todo-title",
    )
    description = TextAreaField(
        "Description", validators=[Length(max=250)], id="form-edit-todo-description"
    )
    submit = SubmitField("UPDATE", id="form-edit-todo-submit")

    def load_choices(self, user_id):
        with current_app.app_context():
            projects = Projects.query.filter(Projects.user_id == user_id)
            self.project.choices = [
                (project.project_id, project.title) for project in projects
            ]
