from sqlalchemy import Column, String, Text, DateTime
from sqlalchemy.sql import func
from .db import Base

class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(String, primary_key=True, index=True)
    citizen_name = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    email = Column(String, nullable=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    address = Column(Text, nullable=True)
    maps_link = Column(String, nullable=True)
    category = Column(String, nullable=True)
    department = Column(String, nullable=True)
    zone = Column(String, nullable=True)
    status = Column(String, default="submitted")
    created_at = Column(DateTime(timezone=True), server_default=func.now())