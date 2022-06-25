from dataclasses import dataclass
from datetime import datetime
from uuid import uuid4

from sqlalchemy import Boolean, Column, DateTime, String

from app.configs.database import db


@dataclass
class Currency(db.Model):

    id: str
    code: str
    label: str
    backing_currency: bool
    created_at: datetime
    updated_at: datetime

    __tablename__ = "currencies"

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    code = Column(String(50), unique=True, nullable=False)
    label = Column(String(100), unique=True, nullable=False)
    backing_currency = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.now())
    updated_at = Column(DateTime, default=datetime.now())
