from http import HTTPStatus

from flask import jsonify

from app.classes.app_with_db import current_app
from app.models import Cotation, Currency


def register_currency():
    validated_data: dict = current_app.validated_data

    session = current_app.db.session
    query = session.query(Currency)

    conversion = validated_data["conversion"]

    USD_value: float = conversion["USD"]
    local_value: float = conversion["local"]

    USD_based = local_value > USD_value

    rate = (local_value / USD_value) if USD_based else USD_value / local_value

    new_currency = Currency(
        code=validated_data["code"],
        label=validated_data["label"],
        is_crypto=validated_data.get("is_crypto", False),
    )

    USD_currency = query.filter_by(code="USD").first()

    cotation_code = (
        f'USD{validated_data["code"]}' if USD_based else f'{validated_data["code"]}USD'
    )

    from_currency = new_currency if USD_based else USD_currency
    to_currency = USD_currency if USD_based else new_currency

    cotation = Cotation(
        code=cotation_code,
        rate=round(rate, 4),
    )

    cotation.from_currency = from_currency
    cotation.to_currency = to_currency

    session.add(cotation)
    session.commit()

    return jsonify(new_currency), HTTPStatus.CREATED
