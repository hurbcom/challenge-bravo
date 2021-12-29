from flask import Flask
from flask_restx import Api, Resource

from server.server import ServerInitializer
from werkzeug.utils import cached_property

mocked_coins = { 'BTC' : { 'USD' : 1, 'BRL' : 6}}

@ServerInitializer.api.route('/convert')
class ConversionController(Resource):

    def get(self, ):
        return mocked_coins