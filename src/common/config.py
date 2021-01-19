from os import getenv
from flask import Flask
from dotenv import load_dotenv
from mongoengine import connect
from pathlib import Path

from exception import global_exception_handler
from .swagger import configure_swagger

env = getenv("ENV")
local_test = getenv("LOCAL_TEST")

base_env_path = Path(__file__).resolve().parent.parent.parent

if env == "test":
    database = f"bravo-{env}"
    if local_test:
        env_path = base_env_path / ".env.test.local"
    else:
        env_path = base_env_path / ".env.test"
else:
    database = "bravo"
    if local_test:
        env_path = base_env_path / ".env.local"
    else:
        env_path = base_env_path / ".env"

load_dotenv(dotenv_path=env_path)

mongodb_uri = getenv("MONGODB_URI")

connect(db=database, host=mongodb_uri)

app = Flask(__name__)

global_exception_handler(app)
configure_swagger(app)
