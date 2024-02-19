from functools import lru_cache

from pydantic_settings import BaseSettings


class Settings(BaseSettings):

    ENVIROMENT: str = ""
    HOST: str = "localhost"
    PORT: str = "8000"
    IS_DEBUG: bool = False
    WORKERS: int = 2

    # Mongo
    MONGO_USER: str = "root"
    MONGO_PASSWORD: str = "pass"
    MONGO_PORT: int = 27017

    class Config:
        env_file = ".env"


@lru_cache
def return_default_settings() -> Settings:
    return Settings()
