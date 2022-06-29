from datetime import datetime
from http import HTTPStatus

import requests
from flask import jsonify, request

from app.classes.app_with_db import current_app as curr_app
from app.services import register_cotation


def get_conversion():
    query_params = request.args
    _from = query_params.get("from")
    to = query_params.get("to")
    amount = query_params.get("amount", type=float)
    conversion = amount
    quote_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    if curr_app.cotation:
        conversion = amount * curr_app.cotation.rate
        quote_date = curr_app.cotation.updated_at.strftime("%Y-%m-%d %H:%M:%S")

    elif _from != to:
        url = f"https://economia.awesomeapi.com.br/last/{_from}-{to}"

        response = requests.get(url)

        if response.status_code == HTTPStatus.NOT_FOUND:
            return jsonify({"error": "deu ruim!"}), HTTPStatus.NOT_FOUND

        json = response.json()

        conversion_data = json[f"{_from}{to}"]

        _from = conversion_data["code"]
        to = conversion_data["codein"]
        quote_date = conversion_data["create_date"]

        rate = conversion_data.get("bid", 1)

        conversion = amount * float(rate)

        register_cotation(rate, quote_date)

    payload = {
        _from: amount,
        to: conversion,
        "quote_date": quote_date,
    }

    return jsonify(payload), HTTPStatus.OK
