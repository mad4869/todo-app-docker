from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField


class RegisterForm(FlaskForm):
    name = StringField(label="Nama")
    role = StringField(label="Role")
    email = StringField(label="Email")
    password = PasswordField(label="Password")
    confirm_password = PasswordField(label="Confirm Password")
    submit = SubmitField(label="CREATE ACCOUNT")
