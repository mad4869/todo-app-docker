from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt

from flask_login import LoginManager

db = SQLAlchemy()
migrate = Migrate()
bcrypt = Bcrypt()
login_manager = LoginManager()


def create_app():
    from .routes import todo_bp
    from . import models

    app = Flask(__name__)

    app.config.from_pyfile("../config.py")
    app.register_blueprint(todo_bp)

    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    login_manager.init_app(app)

    return app


app = create_app()
