from fastapi import status
from starlette.testclient import TestClient

from challenge_bravo.main import app


client = TestClient(app)


def test_root_status_code():
    response = client.get('/')
    assert response.status_code == status.HTTP_200_OK


def test_root_response_json():
    response = client.get('/')
    assert response.json() == {
        'message': 'Welcome to the bravo coin'
                   ' converter, check /docs for allowed routes and methods'}


def test_welcome_status_code():
    response = client.get('/api/v1')
    assert response.status_code == status.HTTP_200_OK


def test_welcome_response_json():
    response = client.get('/api/v1')
    assert response.json() == {
        'message': 'Welcome to the bravo coin'
                   ' converter, check /docs for allowed routes and methods'}
