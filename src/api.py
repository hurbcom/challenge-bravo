from flask import Flask
from flask_restful import Api
from controllers import Convert

app = Flask(__name__)

app.route('/')
api = Api(app)
api.add_resource(Convert, '/convert/')

app.run(threaded=True)