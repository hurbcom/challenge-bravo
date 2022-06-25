from flask import Flask, current_app
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import Session


class DBWithSession(SQLAlchemy):
    ''' Usado para intellisense da session. '''
    session: Session


class AppWithDb(Flask):
    ''' Usado para inlellisense do app com atributo db. '''
    db: DBWithSession


''' Intellisense do current app'''
current_app: AppWithDb = current_app
