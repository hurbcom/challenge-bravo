from flask import Flask
from flask_restful import Api
from . views import CarregaMoeda


def createApp():
    app = Flask(__name__)
    register_resource(app)
    return app


def register_resource(app):
    api = Api(app)
    api.add_resource(views.CarregaMoeda, '/')
    api.add_resource(views.InserirMoeda, '/inserir/')
    api.add_resource(views.ConsultarMoeda, '/consultar/')
    api.add_resource(views.ExcluirMoeda, '/excluir')

