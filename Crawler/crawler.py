# -*- coding: utf-8 -*-
import json
import os
import sys
import time
from time import sleep
import logging
import requests

from datetime import datetime

from utils import mongo_utils as mu
from utils.error_utils import ErrorUtils

global logger
global config

cryptopain         = "https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,USD,EUR&tsyms=BTC,ETH,USD,EUR,BRL&api_key={}"
configuration_file = "./input/config.json"


def build_config_params(full_path):
    global config
    with open(full_path) as f:
        config = json.loads(f.read())


def log_msg(msg, level):
    timestr   = time.strftime("[%Y-%m-%d %H:%M:%S] ", time.localtime())
    final_msg = timestr + msg
    print(final_msg)
    logger.log(level, final_msg)


def init_logger():
    global logger
    logger = logging.getLogger(config['logger']['logger_name'])
    logger.setLevel(logging.DEBUG)
    logger.propagate = True

    # Criando o arquivo
    handler = logging.FileHandler(os.path.join(config['logger']['logger_output_path'], config['logger']['logger_filename']))
    handler.setLevel(logging.DEBUG)

    # Criando o formato de log
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    handler.setFormatter(formatter)

    # Adicionando para o log
    logger.addHandler(handler)


def write_on_mongo(collection, result):
    ''' Metodo para inserir os dados no mongo'''
    try:
        collection.insert_one(result)
        log_msg("Inserted data on database", logging.INFO)
    except Exception as ex:
        log_msg(ex.message)


def main(collection):
    while True:
        result = {}
        # Realizando um requisição get
        response = requests.get(cryptopain.format(config['hurb_key']))

        # Verificando resposta da requisição
        if response.ok is True:
            log_msg("Get request successful", logging.DEBUG)

            # pegando o json da resposta
            result["coins"] = response.json()
            # gruardando a data de captura
            result["updatedAt"] = datetime.now()
            # inserindo os dados no mongo
            write_on_mongo(collection, result)
        else:
            # mapeando os erros
            code = response.status_code
            if code == 400:
                log_msg(ErrorUtils.get_message(100), logging.ERROR)
            elif code == 401:
                log_msg(ErrorUtils.get_message(101), logging.WARN)
            elif code == 403:
                log_msg(ErrorUtils.get_message(102), logging.CRITICAL)
            elif code == 500:
                log_msg(ErrorUtils.get_message(998), logging.WARN)
        #  dormindo para a próxia requisição
        sleep(config['timeout'])

if __name__ == "__main__":
    # Lendo parametros do arquivo json
    build_config_params(configuration_file)

    # Inicializa o logger
    init_logger()

    # Abrindo conexão com o mongo
    collection, result = mu.open_mongo_connection(config['mongo']['hurb'])

    # verificando o resultado da conexão
    if result == False:
        log_msg('Error to open mongo connection', logging.CRITICAL)
        sys.exit(1)

    log_msg('MongoBD connection successful', logging.INFO)

    main(collection)