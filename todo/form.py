from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, validators


class RegisterForm(FlaskForm):
    name = StringField(
        label="Nama",
        validators=[validators.Length(min=1, max=50), validators.InputRequired()],
    )
    role = StringField(
        label="Role",
        validators=[validators.Length(min=1, max=50), validators.InputRequired()],
    )
    email = StringField(
        label="Email",
        validators=[
            validators.Length(min=1, max=50),
            validators.InputRequired(),
            validators.Email(),
        ],
    )
    password = PasswordField(
        label="Password",
        validators=[validators.Length(min=6, max=100), validators.InputRequired()],
    )
    confirm_password = PasswordField(
        label="Confirm Password",
        validators=[validators.EqualTo("password"), validators.InputRequired()],
    )
    submit = SubmitField(label="CREATE ACCOUNT")
