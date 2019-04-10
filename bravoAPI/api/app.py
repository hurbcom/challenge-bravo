from flask import Flask, request, json
from config import *
import pymongo as pym
import os

from utils import mongo_utils as mu
from utils import utils

app = Flask(__name__)
app.config.from_object("config")

def process_args():
    # getting all values from request
    result      = {}
    amount      = request.args.get('amount')
    convertFrom = request.args.get('from')
    to          = request.args.get('to')

    result['AMOUNT']     = amount
    result['FROM']      = convertFrom.upper()
    result['TO']        = to.upper()

    return result


def analyzeInput(args):
    error_msg = ''
    if args['FROM'] not in COINS_AVAILABLE or args['TO'] not in COINS_AVAILABLE:
        error_msg = {'Error Messege' :'This coins is not available to convert'}
        return False, error_msg

    if args['AMOUNT'] == '':
        error_msg = {'Error Messege' : 'Please! we need to known the amount'}
        return False, error_msg

    if utils.is_int_or_float(args['AMOUNT']) == -1:
        error_msg = {'Error Messege' :'Please! Is required a valid amount'}
        return False, error_msg

    if float(str(args['AMOUNT'])) <= -1:
        error_msg = {'Error Messege' :'Please! Insert a positive number'}
        return False, error_msg

    #for k, v in args.items():
    #    if args[k] is None:
    #        error_msg = {'Error Messege' :'One or more field are required'}
    #        return False, error_msg

    return True, error_msg

@app.route('/')
def hello_world():
    return 'I am very well and alive . Thanks'

@app.route('/api/v1/bravo')
def bravo():
    # Process request arguments
    args = process_args()

    result, error_msg = analyzeInput(args)
    # valid input
    if not result:
        return json.dumps(error_msg)

    # Open Mongo Connection
    collection, result = mu.open_mongo_connection()
    # get last record
    record   = collection.find_one(sort=[( '_id', pym.DESCENDING )])
    response = {}
    # precisa converter a data pra utc now
    response['Updated At']  = record['updatedAt'].strftime("%Y-%m-%d %H:%M:%S")
    response['From']        = args['FROM']
    response['To']          = args['TO']

    if args['FROM'] == args['TO']:
        response['Converted'] = args['AMOUNT']
    elif args['TO'] == 'BRL':
        value = float(args['AMOUNT']) * float(record['coins'][args['FROM']][args['TO']])
        response['Converted'] = round(value,2)
    elif args['FROM'] == 'BRL':
        value = float(args['AMOUNT']) / float(record['coins'][args['TO']][args['FROM']])
        response['Converted'] = round(value,2)
    else:
        value = float(args['AMOUNT']) * float(record['coins'][args['FROM']][args['TO']])
        response['Converted'] = round(value,2)

    return  json.dumps(response)


if __name__ == '__main__':
    port = int(os.environ.get("PORT", PORT))
    app.run(host='0.0.0.0', port=port)
