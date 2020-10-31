#--- Setup file to use apispec for documentation ---#

from marshmallow import fields, Schema
from apispec import APISpec
from apispec_webframeworks.flask import FlaskPlugin
from apispec.ext.marshmallow import MarshmallowPlugin
from src.schemas.currency import CurrencySchema

apispec = APISpec(
    title = "Currency Conversion App - Challenge Bravo",
    description = "Currency conversion api",
    version="0.0.1",
    openapi_version = "3.0.2",
    plugins = [FlaskPlugin(), MarshmallowPlugin()]
)

#register schemas 
# apispec.components.schema("Currency", schema=CurrencySchema)

