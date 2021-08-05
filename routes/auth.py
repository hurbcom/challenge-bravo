from flask_login import LoginManager, login_user, logout_user, current_user
from flask import Flask, request, make_response, jsonify
from controllers.auth import AuthController



def authRoutes(app, authManager):

    ctrl = AuthController()

    @authManager.user_loader
    def load_user(user_id):
        user = ctrl.selectOneById(user_id)
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

        user = ctrl.selectOneByEmail(request.json['email'])
        if not user:
            return make_response(jsonify({"message": "Email not found"}), 404)

        Us = load_user(user.id)
        return ctrl.validateUserAndStartSession(request, Us)

    @app.route("/logout", methods=['GET'])
    def logout():
        return ctrl.closeSession()


