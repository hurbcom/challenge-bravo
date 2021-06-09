from flask import Flask
from flask_restful import Api

from resources.exchange import Exchange, Change, Exchanges

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///banco.db'
app.config['SQL_ALCHEMY_MODIFICATIONS'] = True
api = Api(app)


@app.before_first_request
def cria_banco():
    banco.create_all()


api.add_resource(Change, '/change')
api.add_resource(Exchange, '/exchange')
api.add_resource(Exchanges, '/exchanges')


if __name__ == '__main__':
    from sql_alchemy import banco

    banco.init_app(app)
    app.run(debug=True)
