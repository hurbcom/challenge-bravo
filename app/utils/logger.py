from pydantic import BaseModel

from app.utils.config import return_default_settings

settings = return_default_settings()


class LogConfig(BaseModel):
    """
    Ex. de log que achei buscando pela internet com algumas mudanças
    de formato.
    """

    LOGGER_NAME: str = "app"
    LOG_FORMAT: str = ""
    LOG_LEVEL: str = settings.LOG_ENVIROMENT

    # Logging config
    version: int = 1
    disable_existing_loggers: bool = False
    formatters: dict = {
        "default": {
            "()": "uvicorn.logging.DefaultFormatter",
            "fmt": "%(levelprefix)s [%(asctime)s]"
            "[%(filename)s][%(funcName)s][%(message)s]",
            "datefmt": "%Y-%m-%d %H:%M:%S",
        },
    }
    handlers: dict = {
        "default": {
            "formatter": "default",
            "class": "logging.StreamHandler",
            "stream": "ext://sys.stderr",
        },
    }
    loggers: dict = {
        LOGGER_NAME: {"handlers": ["default"], "level": LOG_LEVEL},
    }
