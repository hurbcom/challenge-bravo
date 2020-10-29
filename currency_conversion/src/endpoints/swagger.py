#--- Configure endpoint for swagger ---#

from flask_swagger_ui import get_swaggerui_blueprint

API_URL = '/api/swagger.json'
SWAGGER_URL = '/api/docs'

#setup blueprint and configs for swagger 
swagger_ui = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={
        'app_name': 'Currency Conversion App - Challenge Bravo'
    }
)
