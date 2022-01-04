success_format = { 'success' : True, 'status' : 200 }
error_format = { 'success' : False, 'message' : '', 'status' : 0}

class SuccessResponse():
    def create(coin, json):
        response = success_format
        response[coin] = json
        return response

class ErrorResponse():
    def create(message,status_code):
        response = error_format
        response['message'] = message
        response['status'] = status