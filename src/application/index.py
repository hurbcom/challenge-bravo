from flask import Flask, jsonify, request

from domain.model.currency.conversion import Conversion

app = Flask(__name__)

# Temporary forward declaration
CurrencyIntegration = {}
CurrencyIntegration['validCurrencies'] = ['USD', 'BRL', 'EUR', 'BTC', 'ETH']

@app.route('/currency/convert', methods=['GET'])
def convert():
    # Exception handling is decorated so any exception thrown during validation would result
    # in an automatic catch and be sent to user

    # Inserts the current available currencies into the schemaValidation
    requestArgs = {'validCurrencies': CurrencyIntegration['validCurrencies']}
    requestArgs.update(request.args) 

    # Validation
    
    errors = Conversion.is_valid(requestArgs, CurrencyIntegration['validCurrencies'] )

    if errors:
        return {
            'success':False,
            'errors': errors
        }, 400

    return {
            'success':True,
            'data': {}
        }, 200

if __name__ == "__main__":
    app.run()
    