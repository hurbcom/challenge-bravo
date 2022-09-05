from sqlalchemy import Column, Integer, String, TIMESTAMP, Float, text
from sqlalchemy.ext.declarative import declarative_base


Base = declarative_base()

class OficialCoins(Base):
    __tablename__ = 'oficial_coins'

    id = Column(Integer, primary_key=True)
    currency_code = Column(String, nullable=False, index=True, unique=True)
    rate = Column(Float, nullable=False)
    backed_by = Column(String, nullable=False, server_default='USD')
    updated_at = Column(TIMESTAMP, nullable=False, server_default=text('now()'))
    currency_type = Column(String, nullable=False, index=True, default="oficial")