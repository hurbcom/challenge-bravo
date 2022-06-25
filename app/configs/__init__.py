import os
from datetime import timedelta


class Config:
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JSON_SORT_KEYS = False


class DevelopmentConfig(Config):
    SQLALCHEMY_DATABASE_URI = os.getenv("DB_URI_DEV")


class ProductionConfig(Config):
    SQLALCHEMY_DATABASE_URI = os.getenv("DB_URI")


class TestConfig(Config):
    db_path = os.getenv("DB_TEST_PATH", "db_test.sqlite3")
    SQLALCHEMY_DATABASE_URI = f"sqlite:///{db_path}"


config_selector = {
    "test": TestConfig,
    "development": DevelopmentConfig,
    "production": ProductionConfig,
}
