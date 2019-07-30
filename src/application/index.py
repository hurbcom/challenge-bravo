from flask import Flask, jsonify, request

# from src.model.Conversion import Conversion, ConversionSchema
from model.currency.conversion import Conversion, ConversionSchema
from application.httputils.response import getOkResponseObj, getErrorResponseObj

app = Flask(__name__)

@app.route('/currency/convert', methods=['POST'])
def convert():
    try:
        # json parse
        json = request.get_json()

        # Validation
        conversion = ConversionSchema().load(json)

        return getOkResponseObj('')

    except Exception as ex:
        return getErrorResponseObj(ex)

if __name__ == "__main__":
    app.run()
    