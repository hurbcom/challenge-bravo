from pymongo.collection import Collection
from flask import current_app
from uuid import uuid4
from flask import Response, jsonify
from http import HTTPStatus
from json import loads, dumps
from bson import json_util
from src.utils.errors import ConflictError, AccessDeniedError

DEFAULT_COINS = ('USD','EUR','BTC','ETH','BRL')

class Coins():
    def __init__(self):
        self.db: Collection = current_app.config['mongodb']['coins']

    def insert(self, coin):
        if self.read_by_name(coin['name']) is not None or coin['name'].upper() in DEFAULT_COINS:
            ConflictError(f"there is already a coin with the name {coin['name']}")

        id = str(uuid4())
        self.db.insert_one({
            "id":id,
            "name": coin['name'].upper(),
            "price": coin['price']
        })
        return Response(dumps({'id': id}),status=HTTPStatus.CREATED)

    def list(self, filters):
        result =  self.db.find(filters,{'_id': False})
        if 'name' in filters:
            filters['name'] = filters['name'].upper()
        return jsonify(self.__parse_json(result))

    def read_by_name(self, name):
        result = self.db.find_one({
            "name":name.upper()
        })
        return self.__parse_json(result)

    def update(self, name, price):
        if name.upper() in DEFAULT_COINS:
            AccessDeniedError("this currency cannot be changed.")

        new_values = {"$set": {'price':price}}
        self.db.update_one({'name':name.upper()},new_values)

    def delete(self, name):
        if name.upper() in DEFAULT_COINS:
            AccessDeniedError("this currency cannot be deleted.")

        self.db.delete_one({"name": name.upper()})

    def __parse_json(self, data):
        return loads(json_util.dumps(data))


    