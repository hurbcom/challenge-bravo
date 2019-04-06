from flask import Flask, request, json
from config import *

from utils import mongo_utils as mu

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

    result['AMOUNT']     = amount
    result['FROM']      = convertFrom
    result['TO']        = to

    return result

def analyzeInput(args):
    error_msg = ''
    if args['FROM'] not in COINS_AVAILABLE:
        error_msg = "<h2>This coins is not available to convert</h2>"
        return False, error_msg

    if args['TO'] not in COINS_AVAILABLE:
        error_msg = "<h2>This coins is not available to convert</h2>"
        return False, error_msg

    if args['AMOUNT'] is None:
        error_msg = "<h2>Please! we need to known the amount</h2"
        return False, error_msg

    if isinstance((args['AMOUNT']), int):
        error_msg = "<h2>Please! Is required a valid amount.</h2"
        return False, error_msg

    if float(str(args['AMOUNT'])) <= -1:
        error_msg = "<h2>Please! Insert a positive number</h2"
        return False, error_msg

    for k, v in args.items():
        if args[k] is None:
            error_msg = "<h2>One or more field are required!</h2"
            return False, error_msg

    return True, error_msg

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

    # Open Mongo Connection
    collection, result = mu.open_mongo_connection()
    # get last record
    record = collection.find_one()
    response = {}
    # precisa converter a data pra utc now
    response['Updated At'] = record['updatedAt'].strftime("%Y-%m-%d %H:%M:%S")
    response['From'] = args['FROM']
    response['To'] = args['TO']

    # dolar is base
    if args['FROM'] == 'USD' and  args['TO'] == 'USD':
        response['Converted'] = args['AMOUNT']
    elif args['TO'] == 'USD':
        value = float(args['AMOUNT']) / float(record['coins'][args['FROM']])
        response['Converted'] = round(value,2)
    elif args['FROM'] == 'USD':
        value = float(args['AMOUNT']) * float(record['coins'][args['TO']])
        response['Converted'] = round(value,2)
    elif args['FROM'] == args['TO']:
        response['Converted'] = args['AMOUNT']
    else:
        # WIP
        value_to = float(record['coins'][args['TO']])
        value = float(args['AMOUNT']) * float(record['coins'][args['TO']])
        response['Converted'] = round(value,2)

    return  json.dumps(response)


if __name__ == '__main__':
    app.run()
    app.run(debug=DEBUG)
