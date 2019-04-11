# -*- coding: utf-8 -*-

import pymongo as pym
from config import *


def create_client(host, port):
    '''Criando cliente mongo'''
    return pym.MongoClient(host, port)


def get_database(client, database_name):
    '''Pegando o database do banco'''
    return client[database_name]


def get_collection(db, collection_name):
    '''Pegando a coleção do banco'''
    return db[str(collection_name)]


def open_mongo_connection():
    '''Abrindo conexão com o banco de dados'''
    res = True
    try:
        client = create_client(ADRESS, int(PORT))
        db     = get_database(client, DATABASE)
        db.authenticate(USER, PASS)
        col    = get_collection(db, COLLECTON)
    except Exception as ex:
        res = False
    return col, res