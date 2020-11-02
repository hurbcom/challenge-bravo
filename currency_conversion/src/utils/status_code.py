#-- Customizing status code for return methods --#

#successful messages 
SUCESSFUL_REGISTRATION_201 = {"message": "Currency Code register successfully", "status": 201}
SUCCESFUL_REMOVE_200 = {"message": "Currency Code remove successfully", "status": 200}

#error messages
NOT_FOUND_404 = {"message": "Opps, the currency code is not found!", "status": 404}
NOT_FOUND_DB_405 = {"message": "Opps, the currency code is not found in database!", "status": 405}
NOT_SUPPORTED_CODE_500 = {"message": "Opps, the currency code is not supported!", "status": 500}
CONFLICT_409 = {"message": "Opps, the currency code already exists!", "status":409}
INTERNAL_SERVER_ERROR_500 = {"message": "Internal Server Error", "status": 500}