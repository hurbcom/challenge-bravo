from flask_restful import Resource
from flasgger import swag_from


class Version(Resource):
    def __init__(self, config):
        self.config = config

    @swag_from("../../swagger/models/version/version.yml", endpoint="huby/version")
    def get(self):
        content = {
            "HUBy": 1
        }
        return content
