from http import HTTPStatus


def make_response(success: bool, status_code: HTTPStatus,
                  data=None, errors=list()):
    response = {
        "data": data,
        "errors": errors,
        "success": success
    }, status_code

    return response
