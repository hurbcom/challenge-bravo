from sqlalchemy import Column, Integer, String, Float, text, DateTime
from datetime import datetime

from app.database import Base



class OficialCoin(Base):
    __tablename__ = "oficial_coins"

    id = Column(Integer, primary_key=True)
    currency_code = Column(String, nullable=False, index=True, unique=True)
    rate = Column(Float, nullable=False)
    backed_by = Column(String, nullable=False, server_default="USD")
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=text("now()"), onupdate=datetime.utcnow)
    currency_type = Column(String, nullable=False, index=True, server_default="oficial")


class FantasyCoin(Base):
    __tablename__ = "fantasy_coins"

    id = Column(Integer, primary_key=True)
    currency_code = Column(String, nullable=False, index=True, unique=True)
    rate = Column(Float, nullable=False)
    backed_by = Column(String, nullable=False, server_default="USD")
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=text("now()"), onupdate=datetime.utcnow)
    currency_type = Column(String, nullable=False, index=True, server_default="fantasy")


class FavoriteCoin(Base):
    __tablename__ = 'favorite_coins'

    id = Column(Integer, primary_key=True)
    currency_code = Column(String, nullable=False, index=True, unique=True)
    currency_type = Column(String, nullable=False)