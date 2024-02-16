from pydantic_settings import BaseSettings


class Settings(BaseSettings):

    ENVIROMENT: str = ""
    HOST: str = "localhost"
    PORT: str = "8000"
    IS_DEBUG: bool = False
    WORKERS: int = 2

    class Config:
        env_file = ".env"


def default_settings() -> Settings:
    return Settings()
