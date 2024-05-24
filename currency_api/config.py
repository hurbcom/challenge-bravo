from secrets import SECRET_KEY

class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///currency.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = SECRET_KEY
