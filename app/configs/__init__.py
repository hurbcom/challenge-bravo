import os
from datetime import timedelta


class Config:
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JSON_SORT_KEYS = False


class DevelopmentConfig(Config):
    SQLALCHEMY_DATABASE_URI = os.getenv("DB_URI")


class ProductionConfig(Config):
    SQLALCHEMY_DATABASE_URI = os.getenv("DB_URI")


config_selector = {"development": DevelopmentConfig, "production": ProductionConfig}
