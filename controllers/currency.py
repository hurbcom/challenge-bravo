from flask import Flask, request, make_response, jsonify

class CurrencyController(object):

    def converter(self, source, destiny, amount):
        try:
            return make_response(jsonify({"message": f"Converting {amount} from {source} to {destiny}"}), 200)
        except Exception as err:
            return make_response(jsonify({"err": "Could not cornvet amount value!: "+str(err)}), 500)