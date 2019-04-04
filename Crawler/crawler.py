import json
import os
import sys
import time
from time import sleep
import logging

from datetime       import datetime, timedelta

from utils import mongo_utils as mu

global logger
global config
configuration_file     = "./input/config.json"


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

    # Create a file handler
    handler = logging.FileHandler(os.path.join(config['logger']['logger_output_path'], config['logger']['logger_filename']))
    handler.setLevel(logging.DEBUG)

    # Create a logging format
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    handler.setFormatter(formatter)

    # Adds the handlers to the logger
    logger.addHandler(handler)


def main():
    while True:
        print("Estou aqui...")
        sleep(60)


if __name__ == "__main__":
    # Reads nlp configuration file
    build_config_params(configuration_file)

    # Initialize logger
    init_logger()


    # Open Mongo Connection
    collection, result = mu.open_mongo_connection(config['mongo']['hurb'])

    if result == False:
        log_msg('Error to open mongo connection', logging.CRITICAL)
        sys.exit(1)
    else:
        log_msg('mongoBD connection was  successful', logging.INFO)

    main()