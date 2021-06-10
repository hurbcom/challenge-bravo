import os
from dotenv import load_dotenv
from pathlib import Path

env_path = Path('./') / '.env'
load_dotenv(dotenv_path=env_path)


class Config:
    MONGODB_HOST = os.getenv('MONGODB_HOST', 'mongo')
    MONGODB_DATABASE = os.getenv('MONGODB_DATABASE', 'challenge_bravo')
    EXCHANGE_API_URL = os.getenv('EXCHANGE_API_URL', 'https://api.exchangerate.host/convert')
    MONGODB_USERNAME = os.getenv('MONGODB_USERNAME', 'root')
    MONGODB_PASSWORD = os.getenv('MONGODB_PASSWORD', '123456')
    MONGODB_PORT = os.getenv('MONGODB_PORT', 27017)
