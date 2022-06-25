from dataclasses import dataclass
from datetime import datetime
from uuid import uuid4

from sqlalchemy import Boolean, Column, DateTime, Float, String

from app.configs.database import db


@dataclass
class Cotation(db.Model):

    id: str
    code: str
    label: str
    rate: float
    created_at: datetime
    updated_at: datetime

    __tablename__ = "cotations"

    id = Column(String, primary_key=True, default=str(uuid4()))
    code = Column(String(50), unique=True, nullable=False)
    label = Column(String(100), unique=True, nullable=False)
    rate = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.now())
    updated_at = Column(DateTime, default=datetime.now())
