from flask_restful import Resource
from flasgger import swag_from


class Root(Resource):

    @swag_from("../../swagger/models/root/root.yml", endpoint="/")
    def get(self):
        return {"message": "working"}
