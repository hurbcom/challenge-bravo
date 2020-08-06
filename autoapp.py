import os

from flask.helpers import get_debug_flag
from desafio.app import create_app
from desafio.settings import DevConfig, ProdConfig

ENVIRONMENT_DEBUG = os.environ.get("FLASK_DEBUG", True)

CONFIG = DevConfig if get_debug_flag() else ProdConfig

application = create_app(CONFIG)

if __name__ == "__main__":
    ENVIRONMENT_PORT = os.environ.get("APP_PORT", 5000)
    application.run(host='0.0.0.0', port=ENVIRONMENT_PORT)
