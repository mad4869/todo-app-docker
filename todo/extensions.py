from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_login import LoginManager

from .asset import Asset

# Database engine
db = SQLAlchemy()

# Database migration manager
migrate = Migrate()

# Password hash generator
bcrypt = Bcrypt()

# User authentication manager
login_manager = LoginManager()

# Asset manager
asset = Asset()
