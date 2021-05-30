from fastapi import APIRouter


router = APIRouter()


@router.get('/')
def welcome():
    """
    Main API route.
    Returns info about the API.
    """
    return {
        'message': 'Welcome to the bravo coin converter, '
                   'check /docs for allowed routes and methods',
    }
