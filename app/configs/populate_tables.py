from datetime import datetime
from uuid import uuid4

from alembic import op
from sqlalchemy import Table


def populate_currencies_table(table: Table):
    columns = (
        "id",
        "code",
        "label",
        "backing_currency",
        "is_crypto",
        "created_at",
        "updated_at",
    )
    list_values = [
        (
            str(uuid4()),
            "USD",
            "Dólar Americano",
            True,
            False,
            datetime.now(),
            datetime.now(),
        ),
        (
            str(uuid4()),
            "BRL",
            "Real Brasileiro",
            False,
            False,
            datetime.now(),
            datetime.now(),
        ),
        (
            str(uuid4()),
            "EUR",
            "Euro",
            False,
            False,
            datetime.now(),
            datetime.now(),
        ),
        (
            str(uuid4()),
            "BTC",
            "Bitcoin",
            False,
            True,
            datetime.now(),
            datetime.now(),
        ),
        (
            str(uuid4()),
            "ETH",
            "Ethereum",
            False,
            True,
            datetime.now(),
            datetime.now(),
        ),
    ]

    rows = [dict(zip(columns, values)) for values in list_values]

    op.bulk_insert(table, rows)
