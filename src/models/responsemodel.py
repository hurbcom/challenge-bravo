class SuccessResponse():
    def create(coin, json):
        return { 'success' : True, 'status' : 200, coin : json }

class ErrorResponse():
    def create(message,status_code):
        return { 'success' : False, 'message' : message, 'status' : status_code}