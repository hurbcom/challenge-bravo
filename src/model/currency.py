from datetime import datetime
from mongoengine import Document, StringField, DateTimeField, BooleanField


class Currency(Document):
    name = StringField(max_length=100, required=True)
    iso_code = StringField(min_length=3, max_length=3, required=True, unique=True)
    standard = BooleanField(default=False)
    creation_date = DateTimeField(default=datetime.utcnow)
    update_date = DateTimeField(default=datetime.utcnow)

    meta = {"indexes": ["standard", "$iso_code"]}
