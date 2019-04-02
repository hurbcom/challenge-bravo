from flask import Flask, request
from flask_restful import Resource, Api
from config import *

app = Flask(__name__)
app.config.from_object("config")

def process_args():
    # getting all values from request
    result      = {}
    amount      = request.args.get('amount')
    convertFrom = request.args.get('from')
    to          = request.args.get('to')
    # Sanity check
    if not amount or not convertFrom or not to:
        return None

    result['AMOUT']     = amount
    result['FROM']      = convertFrom
    result['TO']        = to

    return result

def analyzeInput(args):
    error_msg = ''
    if args['FROM'] in COINS_AVAILABLE:
        error_msg = "<h2>This coins is not available to convert</h2>"
        return False, error_msg

    if args['TO'] in COINS_AVAILABLE:
        error_msg = "<h2>This coins is not available to convert</h2>"
        return False, error_msg

    # FIX THIS HTML
    if args is None:
        error_msg = "<h2>One or more field are required!</h2"
        return False, error_msg


@app.route('/')
def hello_world():
    return 'Hello World!'

@app.route('/bravo')
def bravo():
    # Process request arguments
    args = process_args()
    result, error_msg = analyzeInput(args)
    # valid input
    if not result:
        return error_msg

    return "<p>I want convert {} from {} to {}</p>".format(args['AMOUT'], args['FROM'], args['TO'])

if __name__ == '__main__':
    app.run()
    app.run(debug=DEBUG)
