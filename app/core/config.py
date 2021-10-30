import os
from pydantic import BaseSettings


class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    API_EXCHANGE_URL: str = os.getenv("API_EXCHANGE_URL")
    API_EXCHANGE_KEY: str = os.getenv("API_EXCHANGE_KEY")
    SQLALCHEMY_DATABASE_URL: str = os.getenv('DATABASE_URL')

    class Config:
        env_file = ".env"


settings = Settings()
