from flask import Flask
from flask_restx import Api

class ServerInitializer():
    app = Flask(__name__)
    api = Api(app,
              version='1.0',
              title='challenge-bravo',
              description='simple currency consultor api')
    def run(self,):
        self.app.run(debug=True)



server = ServerInitializer()