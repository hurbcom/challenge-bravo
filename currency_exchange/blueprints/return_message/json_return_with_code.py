from flask import make_response, jsonify


def custom_error(message, status_code) -> object:
    """
    This method receive a message and status code and convert it json using the flask methods.
    Thats method is indicated to use with error during the validation. The method has the same
    behavior of sucessfully, but its indicated for better code organization.

    :return: It return a object with message and status code.
    """
    return make_response(jsonify(message), status_code)


def sucessfully(message, status_code):
    """
    This method receive a message and status code and convert it json using the flask methods.
    Thats method is indicated to use with sucess during the validation. The method has the same
    behavior of custom_error, but its indicated for better code organization.

    :return: It return a object with message and status code.
    """
    return make_response(jsonify(message), status_code)
