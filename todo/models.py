from datetime import datetime

from flask_login import UserMixin

from . import db, bcrypt, login_manager


@login_manager.user_loader
def load_user(user_id):
    return Users.query.get(int(user_id))


class Users(db.Model, UserMixin):
    __tablename__ = "users"
    user_id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(length=50), nullable=False)
    role = db.Column(db.String(length=50), nullable=False)
    email = db.Column(db.String(length=50), unique=True, nullable=False)
    password_hash = db.Column(db.String(length=100), nullable=False)
    created_at = db.Column(db.DateTime(), nullable=False, default=datetime.now())
    projects = db.Relationship("Projects", backref="user", lazy=True)

    def get_id(self):
        return self.user_id

    @property
    def password(self):
        return self.password

    @password.setter
    def password(self, plain_text_password):
        self.password_hash = bcrypt.generate_password_hash(plain_text_password).decode(
            "utf-8"
        )

    def password_auth(self, password_input):
        return bcrypt.check_password_hash(self.password_hash, password_input)

    def __repr__(self):
        return f"{self.name}"


class Projects(db.Model):
    __tablename__ = "projects"
    project_id = db.Column(db.Integer(), primary_key=True)
    title = db.Column(db.String(length=100), nullable=False)
    description = db.Column(db.String(length=250))
    user_id = db.Column(db.Integer(), db.ForeignKey("users.user_id"))
    created_at = db.Column(db.DateTime(), nullable=False)
    todos = db.Relationship("Todos", backref="project", lazy=True)

    def __repr__(self):
        return f"{self.title}"


class Todos(db.Model):
    __tablename__ = "todos"
    todo_id = db.Column(db.Integer(), primary_key=True)
    title = db.Column(db.String(length=100), nullable=False)
    description = db.Column(db.String(length=250))
    project_id = db.Column(db.Integer(), db.ForeignKey("projects.project_id"))
    created_at = db.Column(db.DateTime(), nullable=False)
    dones = db.Relationship("Dones", backref="todo", uselist=False)

    def __repr__(self):
        return f"{self.title}"


class Dones(db.Model):
    __tablename__ = "dones"
    done_id = db.Column(db.Integer(), primary_key=True)
    todo_id = db.Column(db.Integer(), db.ForeignKey("todos.todo_id"))
    created_at = db.Column(db.DateTime(), nullable=False)
