from flask import Flask, request, make_response, jsonify
from flask_login import LoginManager, login_user, logout_user, current_user
import sqlite3
from models.user import UserModel
from flask_cors import CORS
import os


app = Flask(__name__)
app.secret_key =  os.getenv('SECRET_KEY')
CORS(app)
app.debug = True
authManager = LoginManager(app)

@authManager.user_loader
def load_user(user_id):
    user = UserModel.selectOneById(user_id)
    if user is None:
        return None
    else:
        return user


@app.route("/auth", methods=['POST'])
def authenticate():

    if current_user.is_authenticated:
        return make_response(jsonify({"message": "User already logged"}), 200)

    if not request.json:
        return make_response(jsonify({"message": "You need provide email and password"}), 400)

    email = request.json['email']
    password = request.json['password']
    result = UserModel.selectOneByEmail(email)

    if not result:
        return make_response(jsonify({"message": "Email not found"}), 404)

    user = list(result)
    Us = load_user(user[0])
    if email == Us.email and password == Us.password:
        login_user(Us, remember=False)
        return make_response(jsonify({"message": "Login successfull"}), 200)
    else:
        return make_response(jsonify({"message": "Login failed! Please verify your credentials and try again."}), 401)


if __name__ == "__main__":
  app.run(host='0.0.0.0',port=8080,threaded=True)