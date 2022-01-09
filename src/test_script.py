import requests

request = requests.delete("http://127.0.0.1:5000/currency?name=HURB")

print(request)