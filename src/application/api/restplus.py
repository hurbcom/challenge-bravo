from flask_restplus import Api

from src.application import settings

api = Api(version='1.0', title='Challenge Bravo',
          description='Micro API for currency conversion')

@api.errorhandler
def default_error_handler(e):
    message = 'An unhandled exception occurred.'

    if not settings.FLASK_DEBUG:
        return {'message': message}, 500
