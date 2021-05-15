from flask_restful import Resource


class Version(Resource):
    def __init__(self, config):
        self.config = config

    def get(self):
        content = {
            "HUBy": 1
        }
        return content
