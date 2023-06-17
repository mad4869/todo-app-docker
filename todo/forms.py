from flask import current_app
from flask_wtf import FlaskForm
from wtforms import (
    StringField,
    PasswordField,
    SubmitField,
    TextAreaField,
    SelectField,
    ValidationError,
)
from wtforms.validators import InputRequired, Length, Email, EqualTo

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
    )
    role = StringField(
        "Role",
        validators=[Length(min=1, max=50), InputRequired()],
    )
    email = StringField(
        "Email",
        validators=[Length(min=1, max=50), InputRequired(), Email()],
    )
    password = PasswordField(
        "Password",
        validators=[Length(min=6, max=100), InputRequired()],
    )
    confirm_password = PasswordField(
        "Confirm Password",
        validators=[EqualTo("password"), InputRequired()],
    )
    submit = SubmitField("CREATE ACCOUNT")


class LoginForm(FlaskForm):
    email = StringField(
        "Email",
        validators=[Length(min=1, max=50), InputRequired(), Email()],
    )
    password = PasswordField(
        "Password",
        validators=[Length(min=6, max=100), InputRequired()],
    )
    submit = SubmitField("LOGIN")


class ProjectForm(FlaskForm):
    project_title = StringField(
        "Title", validators=[Length(min=1, max=100), InputRequired()]
    )
    project_description = TextAreaField("Description", validators=[Length(max=250)])
    submit = SubmitField("ADD")


class TodoForm(FlaskForm):
    project = SelectField("Choose project:", coerce=int, validators=[InputRequired()])
    todo_title = StringField(
        "Title", validators=[Length(min=1, max=100), InputRequired()]
    )
    todo_description = TextAreaField("Description", validators=[Length(max=250)])
    submit = SubmitField("ADD")

    def load_choices(self):
        with current_app.app_context():
            projects = Projects.query.all()
            self.project.choices = [
                (project.project_id, project.title) for project in projects
            ]
