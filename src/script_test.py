import requests

request = requests.put("http://127.0.0.1:5000/currency?name=HURB&value=300")

print(request)