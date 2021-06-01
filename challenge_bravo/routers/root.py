from fastapi import APIRouter


router = APIRouter()


def default_response():
    """ Default response for both '/' and '/api/v1' routes. """

    return {
        'message': 'Welcome to the bravo coin converter, '
                   'check /docs for allowed routes and methods',
    }


@router.get('/')
def root():
    """ Root route. """

    return default_response()


@router.get('/api/v1')
def welcome():
    """ Main API route. """

    return default_response()
