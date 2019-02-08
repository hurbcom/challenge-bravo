import requests

url = "https://min-api.cryptocompare.com/data/price"
querystring = {"fsym":"USD","tsyms":"BRL,EUR,BTC,ETH"}
response = requests.request("GET", url, params=querystring)

usd_rates = response.text

