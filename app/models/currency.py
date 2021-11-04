from sqlalchemy import Column, Integer, String, Float

from app.db.base_class import Base


class Currency(Base):
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, index=True, unique=True)
    rate = Column(Float(precision=10, asdecimal=True, decimal_return_scale=2))
