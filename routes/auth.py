from flask_login import LoginManager, login_user, logout_user, current_user
from flask import Flask, request, make_response, jsonify
from models.user import UserModel

def authRoutes(app, authManager):
    @authManager.user_loader
    def load_user(user_id):
        user = UserModel.selectOneById(user_id)
        if user is None:
            return None
        else:
            return user

    @app.login_manager.unauthorized_handler
    def unauth_handler():
        return jsonify(success=False,
                    data={'login_required': True},
                    message='Unauthorized - You need to logged in to access this page'), 401

    @app.route("/auth", methods=['POST'])
    def authenticate():

        if current_user.is_authenticated:
            return make_response(jsonify({"message": "User already logged"}), 200)

        if not request.json:
            return make_response(jsonify({"message": "You need provide email and password"}), 400)

        email = request.json['email']
        password = request.json['password']
        user = UserModel.selectOneByEmail(email)

        if not user:
            return make_response(jsonify({"message": "Email not found"}), 404)

        Us = load_user(user.id)
        if email == Us.email and password == Us.password:
            login_user(Us, remember=False)
            return make_response(jsonify({"message": "Login successfull"}), 200)
        else:
            return make_response(jsonify({"message": "Login failed! Please verify your credentials and try again."}), 401)

    @app.route("/logout", methods=['GET'])
    def logout():

        if current_user.is_authenticated:
            logout_user()
            return make_response(jsonify({"message": "User logged out"}), 200)
        else:
            return make_response(jsonify({"message": "User is not logged"}), 403)
