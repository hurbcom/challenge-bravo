import requests


def parsing_api(url: str) -> dict:
    """
    This method parsing API with requests library and return it in JSON format to be used.

    :url: must be a valid URL, or it will raise an Exception.
    :return: a dict
    """
    try:
        url = url
        response = requests.get(url)
        req = response.json()
        return req

    except:
        raise Exception