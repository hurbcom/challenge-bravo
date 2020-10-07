from flask_restful import Resource, fields, marshal_with, request
# from main.app import mongodb
from main.common.database import DBClient

class Conversion(Resource):

    conversion_fields = {
        'from': fields.String,
        'to': fields.String,
        'amount': fields.Float,
    }

    @marshal_with(conversion_fields)
    def get(self):
        args = request.args

        # mongo_currencies_collection = mongodb["currencies"]
        #
        # mydict = {"name": "John", "address": "Highway 37"}
        #
        # x = mongo_currencies_collection.insert_one(mydict)

        return args
