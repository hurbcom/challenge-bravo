import http.client
from urllib.parse import urlencode
from contextlib import contextmanager

@contextmanager
def getHttpsConnection(url):
    connection = http.client.HTTPSConnection(url)
    yield connection
    connection.close()

def httpsGet(baseUrl, uri, requestParams):
    with getHttpsConnection(baseUrl) as connection:
        completeUri = str(uri)
        # Encode requestParams
        if requestParams and any(requestParams):
            encodedParams = urlencode(requestParams)

            completeUri += '?{}'.format(encodedParams)

        connection.request("GET", completeUri)
        
        response = connection.getresponse()
        
        print("Status: {} and reason: {}".format(response.status, response.reason))
