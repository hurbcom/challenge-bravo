from functools import lru_cache

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """
    Classe das variaveis de ambiente do projeto
    """

    ENVIROMENT: str = "local"
    LOG_ENVIROMENT: str = "INFO"
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
    """
    Chamamos sempre essa função com os valores em cache
    para evitar aumento de memoria desnecessário.
    """
    return Settings()
