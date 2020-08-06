# -*- coding: utf-8 -*-
"""Application configuration."""
import os


class Config(object):
    """Base configuration."""

    SECRET_KEY = os.environ.get(
        'CONDUIT_SECRET', 'secret-key')
    APP_DIR = os.path.abspath(os.path.dirname(__file__))
    PROJECT_ROOT = os.path.abspath(os.path.join(APP_DIR, os.pardir))
    BCRYPT_LOG_ROUNDS = 13
    DEBUG_TB_INTERCEPT_REDIRECTS = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False


class ProdConfig(Config):
    """Production configuration."""

    ENV = 'prod'
    DEBUG = False

    CACHE_TYPE = "redis"
    CACHE_DEFAULT_TIMEOUT = 300
    CACHE_REDIS_HOST = "redis"
    CACHE_REDIS_PORT = 6379
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL',
                                             'postgresql://localhost/example')


class DevConfig(Config):
    """Development configuration."""

    ENV = 'dev'
    DEBUG = True
    DB_NAME = 'dev.db'

    DB_PATH = os.path.join(Config.PROJECT_ROOT, DB_NAME)
    SQLALCHEMY_DATABASE_URI = 'sqlite:///{0}'.format(DB_PATH)
    CACHE_TYPE = 'simple'


class TestConfig(Config):
    """Test configuration."""

    TESTING = True
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'sqlite://'
