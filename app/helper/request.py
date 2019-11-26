import requests


def http_request(base_url, endpoint="", params={}, method="GET"):
    try:
        response = requests.request(
            method=method,
            url=f"{base_url}{endpoint}",
            params=params
        )
        if not response.ok:
            raise Exception(response.text)
        return response
    except Exception as ex:
        raise ex
