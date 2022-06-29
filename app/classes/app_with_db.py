from typing import TYPE_CHECKING, Union

from flask import Flask, current_app
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import Session

if TYPE_CHECKING:
    from app.models.cotations_model import Cotation
    from app.models.currencies_model import Currency


class DBWithSession(SQLAlchemy):
    """Usado para intellisense da session."""

    session: Session


class AppWithDb(Flask):
    """Usado para inlellisense do app com atributo db."""

    db: DBWithSession
    cotation: Union["Cotation", None]
    from_currency: "Currency"
    to_currency: "Currency"


""" Intellisense do current app"""
current_app: AppWithDb = current_app
