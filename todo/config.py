from os import environ, path
from dotenv import load_dotenv

basedir = path.dirname(__file__)
load_dotenv(path.join(path.dirname(basedir), ".env"))

ENVIRONMENT = environ.get("ENVIRONMENT")
FLASK_APP = environ.get("FLASK_APP")
FLASK_DEBUG = environ.get("FLASK_DEBUG")

SECRET_KEY = environ.get("SECRET_KEY")

SQLALCHEMY_DATABASE_URI = f"postgresql://{environ.get('POSTGRES_USER')}:{environ.get('POSTGRES_PASSWORD')}@{environ.get('POSTGRES_HOST')}:{environ.get('POSTGRES_PORT')}/{environ.get('POSTGRES_DB')}"
