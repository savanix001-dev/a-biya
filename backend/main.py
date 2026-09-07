from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import SessionLocal, engine, Base
from models import Customer, Loan, Payment, BusinessOwner
from schemas import CustomerCreate, CustomerResponse, CustomerUpdate, LoanCreate, LoanResponse, LoanUpdate, PaymentCreate, PaymentResponse, PaymentUpdate, BusinessOwnerCreate, BusinessOwnerResponse, LoginRequest, TokenResponse
from auth import hash_pin, verify_pin, create_access_token

Base.metadata.create_all(bind=engine)

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "a-biya backend is working!"}

@app.post("/customers", response_model=CustomerResponse)
def create_customer(customer: CustomerCreate, db: Session = Depends(get_db)):
    new_customer = Customer(**customer.model_dump())
    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)
    return new_customer

@app.get("/customers", response_model=List[CustomerResponse])
def get_customers(db: Session = Depends(get_db)):
    return db.query(Customer).all()

@app.get("/customers/{customer_id}", response_model=CustomerResponse)
def get_customer(customer_id: int, db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer

@app.put("/customers/{customer_id}", response_model=CustomerResponse)
def update_customer(customer_id: int, updates: CustomerUpdate, db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    update_data = updates.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(customer, key, value)

    db.commit()
    db.refresh(customer)
    return customer

@app.delete("/customers/{customer_id}")
def delete_customer(customer_id: int, db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    db.delete(customer)
    db.commit()
    return {"message": "Customer deleted successfully"}

@app.post("/loans", response_model=LoanResponse)
def create_loan(loan: LoanCreate, db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(Customer.id == loan.customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    new_loan = Loan(**loan.model_dump())
    db.add(new_loan)
    db.commit()
    db.refresh(new_loan)
    return new_loan

@app.get("/loans", response_model=List[LoanResponse])
def get_loans(db: Session = Depends(get_db)):
    return db.query(Loan).all()

@app.get("/customers/{customer_id}/loans", response_model=List[LoanResponse])
def get_customer_loans(customer_id: int, db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return db.query(Loan).filter(Loan.customer_id == customer_id).all()

@app.get("/loans/{loan_id}", response_model=LoanResponse)
def get_loan(loan_id: int, db: Session = Depends(get_db)):
    loan = db.query(Loan).filter(Loan.id == loan_id).first()
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    return loan

@app.put("/loans/{loan_id}", response_model=LoanResponse)
def update_loan(loan_id: int, updates: LoanUpdate, db: Session = Depends(get_db)):
    loan = db.query(Loan).filter(Loan.id == loan_id).first()
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")

    update_data = updates.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(loan, key, value)

    db.commit()
    db.refresh(loan)
    return loan

@app.delete("/loans/{loan_id}")
def delete_loan(loan_id: int, db: Session = Depends(get_db)):
    loan = db.query(Loan).filter(Loan.id == loan_id).first()
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")

    db.delete(loan)
    db.commit()
    return {"message": "Loan deleted successfully"}

@app.post("/payments", response_model=PaymentResponse)
def create_payment(payment: PaymentCreate, db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(Customer.id == payment.customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    new_payment = Payment(**payment.model_dump())
    db.add(new_payment)
    db.commit()
    db.refresh(new_payment)
    return new_payment

@app.get("/payments", response_model=List[PaymentResponse])
def get_payments(db: Session = Depends(get_db)):
    return db.query(Payment).all()

@app.get("/customers/{customer_id}/payments", response_model=List[PaymentResponse])
def get_customer_payments(customer_id: int, db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return db.query(Payment).filter(Payment.customer_id == customer_id).all()

@app.get("/payments/{payment_id}", response_model=PaymentResponse)
def get_payment(payment_id: int, db: Session = Depends(get_db)):
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    return payment

@app.put("/payments/{payment_id}", response_model=PaymentResponse)
def update_payment(payment_id: int, updates: PaymentUpdate, db: Session = Depends(get_db)):
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")

    update_data = updates.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(payment, key, value)

    db.commit()
    db.refresh(payment)
    return payment

@app.delete("/payments/{payment_id}")
def delete_payment(payment_id: int, db: Session = Depends(get_db)):
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")

    db.delete(payment)
    db.commit()
    return {"message": "Payment deleted successfully"}


@app.post("/register", response_model=BusinessOwnerResponse)
def register(owner: BusinessOwnerCreate, db: Session = Depends(get_db)):
    existing = db.query(BusinessOwner).filter(BusinessOwner.phone == owner.phone).first()
    if existing:
        raise HTTPException(status_code=400, detail="This phone number is already registered")

    new_owner = BusinessOwner(
        phone=owner.phone,
        hashed_pin=hash_pin(owner.pin),
        business_name=owner.business_name
    )
    db.add(new_owner)
    db.commit()
    db.refresh(new_owner)
    return new_owner


@app.post("/login", response_model=TokenResponse)
def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    owner = db.query(BusinessOwner).filter(BusinessOwner.phone == credentials.phone).first()
    if not owner or not verify_pin(credentials.pin, owner.hashed_pin):
        raise HTTPException(status_code=401, detail="Invalid phone number or PIN")

    token = create_access_token({"owner_id": owner.id})
    return {"access_token": token, "token_type": "bearer"}
