from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CustomerCreate(BaseModel):
    name: str
    phone: Optional[str] = None
    address: Optional[str] = None

class CustomerResponse(BaseModel):
    id: int
    name: str
    phone: Optional[str] = None
    address: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class CustomerUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None

from datetime import date
from decimal import Decimal

class LoanCreate(BaseModel):
    customer_id: int
    amount: Decimal
    item: Optional[str] = None
    date_given: Optional[date] = None
    due_date: Optional[date] = None

class LoanResponse(BaseModel):
    id: int
    customer_id: int
    amount: Decimal
    item: Optional[str] = None
    date_given: Optional[date] = None
    due_date: Optional[date] = None
    created_at: datetime

    class Config:
        from_attributes = True

class LoanUpdate(BaseModel):
    amount: Optional[Decimal] = None
    item: Optional[str] = None
    date_given: Optional[date] = None
    due_date: Optional[date] = None

class PaymentCreate(BaseModel):
    customer_id: int
    amount: Decimal
    date_paid: Optional[date] = None

class PaymentResponse(BaseModel):
    id: int
    customer_id: int
    amount: Decimal
    date_paid: Optional[date] = None
    created_at: datetime

    class Config:
        from_attributes = True

class PaymentUpdate(BaseModel):
    amount: Optional[Decimal] = None
    date_paid: Optional[date] = None
