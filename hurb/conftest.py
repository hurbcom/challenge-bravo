import pytest
from rest_framework.test import APIClient
from hurb.base.models import User


# API
@pytest.fixture
def api_client():
    return APIClient()


# User
@pytest.fixture
def user(db):
    return User.objects.create_superuser(
        email='example@email.com',
        password='test_pass'
    )
