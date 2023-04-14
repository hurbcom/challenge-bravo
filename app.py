import requests
from flask import Flask, request

app = Flask(__name__)

#ex.: http://localhost:5000/search?from=USD&to=BRL&amount=1.5

@app.route('/search', methods=['GET'])
def search():
    args = request.args
    from_ = args.get('from')
    to = args.get('to')
    amount = args.get('amount')
    url = f'https://api.apilayer.com/exchangerates_data/convert?to={to}&from={from_}&amount={amount}'
    payload = {}
    headers = {
        "apikey": "pr1wXqypLyfspgYx638iSsofcFCtBh6D"
    }

    response = requests.request("GET", url, headers=headers, data=payload)

    status_code = response.status_code
    result = response.text

    return result


app.run(host="localhost", port=5000, debug=True)