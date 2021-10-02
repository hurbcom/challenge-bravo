import requests


def parsing_api(url: str) -> object:
    url = url
    response = requests.get(url)
    req = response.json()

    return req