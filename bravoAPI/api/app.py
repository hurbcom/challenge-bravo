# -*- coding: utf-8 -*-

from flask import Flask, request, json
from config import *
import pymongo as pym
import os

from utils import mongo_utils as mu
from utils import utils

app = Flask(__name__)
app.config.from_object("config") # carregando todos os valores de configuração

def process_args():
    # Obtendo todos os valores de input da requisição
    result      = {}
    amount      = request.args.get('amount')
    convertFrom = request.args.get('from')
    to          = request.args.get('to')
    # Adicionando os valores no dicionário
    result['AMOUNT']     = amount
    result['FROM']      = convertFrom.upper()
    result['TO']        = to.upper()
    # retornando os valores obtidos
    return result


def analyzeInput(args):
    '''Função para validar argumento de entrada na requisição'''
    error_msg = ''
    # Verifica se os tipo da moeda solicitada no input está disponível para conversão
    if args['FROM'] not in COINS_AVAILABLE or args['TO'] not in COINS_AVAILABLE:
        error_msg = {'Error Messege' :'This coins is not available to convert'}
        return False, error_msg

    # Verificar se tem um valor nesse argumento para fazer a conversão
    if args['AMOUNT'] == '':
        error_msg = {'Error Messege' : 'Please! we need to known the amount'}
        return False, error_msg

    # Verificar se não tem lixo nesse campo
    # Por exemplo: 12b3
    if utils.is_int_or_float(args['AMOUNT']) == -1:
        error_msg = {'Error Messege' :'Please! Is required a valid amount'}
        return False, error_msg
    # verifica se o número informado é um valor positivo
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
    # Pegando todos os argumento na requisição
    args = process_args()

    # Validando os argumentos
    result, error_msg = analyzeInput(args)
    # Requisição válida?
    if not result:
        return json.dumps(error_msg)

    # Abrir conecxão com o mongo
    collection, result = mu.open_mongo_connection()
    # Pegar o último objeto gravado no banco com os valores da moeda
    record   = collection.find_one(sort=[( '_id', pym.DESCENDING )])
    # Inicializando meu dicionário de retorno
    response = {}
    response['Updated At']  = record['updatedAt'].strftime("%Y-%m-%d %H:%M:%S")
    response['From']        = args['FROM']
    response['To']          = args['TO']
    response['Amount']      = args['AMOUNT']

    # Se a entrada for a mesma moeda não é necessário converter
    if args['FROM'] == args['TO']:
        response['Converted'] = args['AMOUNT']
    elif args['TO'] == 'BRL': # para requisições da moeda BRL foi desenvolvido uma lógica especial devido a falta de infomações fornecida pela api base
        value = float(args['AMOUNT']) * float(record['coins'][args['FROM']][args['TO']])
        response['Converted'] = round(value,2)
    elif args['FROM'] == 'BRL':
        value = float(args['AMOUNT']) / float(record['coins'][args['TO']][args['FROM']])
        response['Converted'] = round(value,2)
    else:
        # Fazendo a vonversão da moeda
        value = float(args['AMOUNT']) * float(record['coins'][args['FROM']][args['TO']])
        response['Converted'] = round(value,2)
    # retornando os dados para o cliente
    return  json.dumps(response)


if __name__ == '__main__':
    # configurando a porta
    port = int(os.environ.get("PORT", PORT))
    app.run(host='0.0.0.0', port=port)
