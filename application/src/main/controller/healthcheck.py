from flask_restful import Resource

class Healthcheck(Resource):
    """
    Application status response control class
    """
    def get(self):
        return {'up':True}
