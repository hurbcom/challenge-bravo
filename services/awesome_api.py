import requests

class AwesomeApiService():
    def __init__(self):
        self.url = "https://economia.awesomeapi.com.br/last/"
    def get_bid_value_from_api(self, from_currency: str, to_currency: str):
        path = from_currency.upper() + "-" + to_currency.upper()
        response = requests.get(self.url + path)
        json_response = response.json()
        return json_response[from_currency.upper()+ to_currency.upper()]["bid"]


