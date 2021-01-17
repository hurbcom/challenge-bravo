"""
Add standard currency
"""
from datetime import datetime

dependencies = []


def upgrade(db):
    data = {
        "name": "Brazilian real",
        "iso_code": "BRL",
        "standard": True,
        "creation_date": datetime.utcnow(),
        "update_date": datetime.utcnow(),
    }
    currency = db.currency.find_one({"iso_code": data["iso_code"]})
    if currency:
        db.currency.delete_one({"_id": currency["_id"]})
    db.currency.insert_one(data)


def downgrade(db):
    pass
