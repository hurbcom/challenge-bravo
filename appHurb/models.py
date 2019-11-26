#Importação de módulos e bibliotecas
from datetime import datetime
from . import appHurb
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

#Configuração SQLAlchemy e Sqlite
appHurb.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
appHurb.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.hurbDB'

db = SQLAlchemy(appHurb)

#Classe criada para instanciar objetos e salvar no banco de dados
class Currencies(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(10))
    currency = db.Column(db.String(50))
    value = db.Column(db.Float(20))
    lastro = db.Column(db.String(20))
    update_time = db.Column(db.DateTime, default=datetime.now)
