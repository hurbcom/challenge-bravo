import pytest
from django.urls import reverse

from django_assertions import assert_contains


@pytest.fixture
def resp(client):
    return client.get(reverse('base:home'))


def test_home_status_code(resp):
    assert resp.status_code == 200


def test_home_link(resp):
    assert_contains(resp, reverse('base:home'))
