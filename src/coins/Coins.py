from pymongo.collection import Collection
from flask import current_app
from uuid import uuid4
from flask import Response, jsonify, abort
from http import HTTPStatus
from json import loads, dumps
from bson import json_util

class Coins():
    def __init__(self):
        self.db: Collection = current_app.config['mongodb']['coins']

    def insert(self, coin):
        if (self.__read_by_name(coin['name']) is not None):
            abort(Response(
                response=dumps(
                    {'error': f"there is already a coin with the name {coin['name']}"}
                ), 
                status=HTTPStatus.CONFLICT)
            )
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

    def read(self, name):
        result = self.db.find_one({
            "name":name.upper()
        })
        return jsonify(self.__parse_json(result))

    def __read_by_name(self, name):
        result = self.db.find_one({
            "name":name.upper()
        })
        return self.__parse_json(result)

    def update(self, name, price):
        if(name.upper() == "USD"):
            abort(Response(
                response=dumps(
                    {'error': "USD currency cannot be changed."}
                ), 
                status=HTTPStatus.FORBIDDEN)
            )
        new_values = {"$set": {'price':price}}
        self.db.update_one({'name':name.upper()},new_values)

    def delete(self, name):
        if(name.upper() == "USD"):
            abort(Response(
                response=dumps(
                    {'error': "USD currency cannot be deleted."}
                ), 
                status=HTTPStatus.FORBIDDEN)
            )
        self.db.delete_one({"name": name.upper()})

    def calculate(self, coin_from, coin_to, value):
        result_from = self.__read_by_name(coin_from.upper())
        result_to = self.__read_by_name(coin_to.upper())
        if not result_from or not result_to:
            abort(Response(response=dumps({'error': f"{coin_from} or {coin_to} not registered."}), 
                status=HTTPStatus.UNPROCESSABLE_ENTITY)
            )
        result = result_from['price'] / result_to['price']
        return jsonify({'result': float('{:.2f}'.format(result * value))})

    def __parse_json(self, data):
        return loads(json_util.dumps(data))


    