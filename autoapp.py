import os
import logging

from flask.helpers import get_debug_flag
from desafio.app import create_app
from desafio.settings import DevConfig, ProdConfig
from logging.config import dictConfig
from flask.logging import default_handler

CONFIG = DevConfig if get_debug_flag() else ProdConfig
application = create_app(CONFIG)

dictConfig({
    'version': 1,
    'formatters': {'default': {
        'format': '[%(asctime)s] %(levelname)s in %(module)s: %(message)s',
    }},
    'handlers': {'wsgi': {
        'class': 'logging.StreamHandler',
        'stream': 'ext://flask.logging.wsgi_errors_stream',
        'formatter': 'default'
    }},
    'root': {
        'level': 'DEBUG',
        'handlers': ['wsgi']
    }
})

for logger in (
    application.logger,
    logging.getLogger('sqlalchemy'),
):
    logger.addHandler(default_handler)


if __name__ == "__main__":
    ENVIRONMENT_PORT = os.environ.get("APP_PORT", 5000)
    application.run(host='0.0.0.0', port=ENVIRONMENT_PORT)
