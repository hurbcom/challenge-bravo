from flask_login import current_user, login_required
from flask import Flask, request, make_response, jsonify


def testRoutes(app):

    @app.route("/test", methods=['GET'])
    @login_required
    def test():
        return make_response(jsonify({"message": "Welcome!"}), 200)


