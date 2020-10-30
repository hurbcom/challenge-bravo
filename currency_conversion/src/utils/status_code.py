#-- Customizing status code for return methods --#
from flask_api import status

#successful messages 
SUCESSFUL_REGISTRATION_201 = {"message": "Currency Code register successfully", "status": status.HTTP_201_CREATED}
SUCCESFUL_REMOVE_200 = {"message": "Currency Code remove successfully", "status": status.HTTP_200_OK}

#error messages
NOT_FOUND_404 = {"message": "Opps, the currency code is not found!", "status": status.HTTP_404_NOT_FOUND}
NOT_FOUND_DB_404 = {"message": "Opps, the currency code is not found in database!", "status": status.HTTP_404_NOT_FOUND}
NOT_SUPPORTED_CODE_500 = {"message": "Opps, the currency code is not supported!", "status": status.HTTP_500_INTERNAL_SERVER_ERROR}
CONFLICT_409 = {"message": "Opps, the currency code already exists!", "status": status.HTTP_409_CONFLICT}
INTERNAL_SERVER_ERROR_500 = {"message": "Internal Server Error", "status": status.HTTP_500_INTERNAL_SERVER_ERROR}