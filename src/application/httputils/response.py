from http import HTTPStatus

def getErrorResponseObj(exception):
    if not issubclass(type(exception), BaseException):
        raise TypeError('exception argument must be of base class Exception')

    errorResponse = _getResponseObj(HTTPStatus.INTERNAL_SERVER_ERROR, False, exception.args)
        
    return errorResponse

def getOkResponseObj(message):
    response = _getResponseObj(HTTPStatus.OK, True, message)

    return response

    
def _getResponseObj(httpStatus, successFlag, message):
    obj = {
        "success": successFlag,
        "message": message
    }

    return (obj, httpStatus)