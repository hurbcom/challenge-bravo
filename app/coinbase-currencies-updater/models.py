from sqlalchemy import TIMESTAMP, Column, Float, Integer, String, text
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class CoinbaseCurrenciesPublicApiModel(Base):
    __tablename__ = "coinbase"

    id = Column(Integer, primary_key=True)
    currency_code = Column(String, nullable=False, index=True, unique=True)
    rate = Column(Float, nullable=False)
    backed_by = Column(String, nullable=False, server_default="USD")
    updated_at = Column(TIMESTAMP, nullable=False, server_default=text("now()"))
    currency_type = Column(String, nullable=False, index=True, default="coinbase")