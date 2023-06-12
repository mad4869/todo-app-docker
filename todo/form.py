from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, ValidationError
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
        label="Nama",
        validators=[Length(min=1, max=50), InputRequired()],
    )
    role = StringField(
        label="Role",
        validators=[Length(min=1, max=50), InputRequired()],
    )
    email = StringField(
        label="Email",
        validators=[Length(min=1, max=50), InputRequired(), Email()],
    )
    password = PasswordField(
        label="Password",
        validators=[Length(min=6, max=100), InputRequired()],
    )
    confirm_password = PasswordField(
        label="Confirm Password",
        validators=[EqualTo("password"), InputRequired()],
    )
    submit = SubmitField(label="CREATE ACCOUNT")


class LoginForm(FlaskForm):
    email = StringField(
        label="Email",
        validators=[Length(min=1, max=50), InputRequired(), Email()],
    )
    password = PasswordField(
        label="Password",
        validators=[Length(min=6, max=100), InputRequired()],
    )
    submit = SubmitField(label="LOGIN")
