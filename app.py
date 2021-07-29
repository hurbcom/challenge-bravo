from flask import Flask, request, make_response, jsonify
from flask_login import LoginManager, current_user
import sqlite3
from models.user import UserModel
from flask_cors import CORS
import os
from project.settings import HOST, PORT, DEBUG

from routes.auth import authRoutes
from routes.test import testRoutes


app = Flask(__name__)
app.secret_key =  os.getenv('SECRET_KEY')
CORS(app)
app.debug = DEBUG
authManager = LoginManager(app)
authRoutes(app, authManager)
testRoutes(app)

if __name__ == "__main__":
  app.run(host=HOST, port=PORT, threaded=True)