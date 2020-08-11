from alembic import op
import sqlalchemy as sa


def data_upgrades():
    currency = sa.MetaData().Currency()
    op.bulk_insert(currency,
                   [
                       {
                           'simbol_currency': 'BRL',
                           'name_description': 'Real'
                       }
                   ]
                   )
