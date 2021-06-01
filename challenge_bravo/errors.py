from fastapi import HTTPException
from fastapi import status


class ObjectDoesNotExist(HTTPException):
    """Custom exception to handle missing database objects.
    If custom message and status code is provided they will be used,
    otherwise the default not found object error is raised.
    """

    def __init__(self, status_code=None, detail=None, headers=None):
        if not status_code:
            status_code = status.HTTP_404_NOT_FOUND
        if not detail:
            detail = 'No object found with the specified ID.'
        super().__init__(status_code, detail, headers)
