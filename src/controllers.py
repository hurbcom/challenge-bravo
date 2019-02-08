
from flask_restful import Resource
from flask import request

class Convert(Resource):

    #GET da api que retorna a moeda convertida
    def get(self):
        base = request.args.get('base', str)
        target = request.args.get('target', str)
        value = float(request.args.get('value', float))

        return 200

