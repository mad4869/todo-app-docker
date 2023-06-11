from passlib.hash import bcrypt
from . import db


class Users(db.Model):
    __tablename__ = "users"
    user_id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(length=50), nullable=False)
    role = db.Column(db.String(length=50), nullable=False)
    email = db.Column(db.String(length=50), unique=True, nullable=False)
    password_hash = db.Column(db.String(length=100), nullable=False)
    created_at = db.Column(db.DateTime(), nullable=False)
    projects = db.Relationship("Projects", backref="user", lazy=True)

    def set_password(self, password):
        self.password_hash = bcrypt.hash(password)

    def check_password(self, password):
        return bcrypt.verify(password, self.password_hash)

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
