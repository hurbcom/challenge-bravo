from marshmallow import Schema, fields, post_load
import datetime

class Conversion():
    def __init__(self, dataDict):
        self.from_ = dataDict['from']
        self.to = dataDict['to']
        self.amount = dataDict['amount']

    def __repr__(self):
        return '<Conversion(from={self.from_!r},to={self.to!r},amount={self.amount!r})>'.format(self=self)

class ConversionSchema(Schema):
    class Meta:
        # Meta style required because of "from" parameter, which is a keyword in python
        # for being a keyword
        fields = ('from', 'to', 'amount')

    @post_load
    def make_conversion(self, dataDict):
        return Conversion(dataDict)
        