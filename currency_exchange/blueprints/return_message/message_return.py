from flask import make_response, jsonify


def custom_error(message, status_code):
    return make_response(jsonify(message), status_code)


def sucessfully(message, status_code):
    return make_response(jsonify(message), status_code)