from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ComplaintCreate(BaseModel):
    citizen_name: str
    phone: Optional[str] = None
    email: Optional[str] = None
    title: str
    description: str
    address: Optional[str] = None
    maps_link: Optional[str] = None


class ComplaintResponse(BaseModel):
    id: str
    citizen_name: str
    phone: Optional[str] = None
    email: Optional[str] = None
    title: str
    description: str
    address: Optional[str] = None
    maps_link: Optional[str] = None
    category: Optional[str] = None
    department: Optional[str] = None
    zone: Optional[str] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True