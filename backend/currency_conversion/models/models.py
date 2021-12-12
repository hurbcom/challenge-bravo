from datetime import datetime
from sqlalchemy import (Boolean, 
                        Column, 
                        Integer,
                        String 
                        )
from sqlalchemy.sql.sqltypes import Date, Float  
from database import Base


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    name = Column(String)
    password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)


class Currencys(Base):
    __tablename__ = "currencys"
    
    id = Column(Integer, primary_key=True, index=True)
    currency = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    for_buy = Column(Float, nullable=False)
    for_send = Column(Float, nullable=False)
    last_update = Column(Date, default=datetime.now())