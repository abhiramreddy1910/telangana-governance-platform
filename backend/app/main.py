from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from datetime import datetime, timedelta
import uuid
import os
from dotenv import load_dotenv

load_dotenv()
from .db import Base, engine, SessionLocal
from .models import Complaint
from .schemas import ComplaintCreate, ComplaintResponse
from .crud import predict_category, map_department, map_zone
from .email_utils import send_email

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Telangana Governance Platform API")

ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-change-this")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Temporary hardcoded official users
fake_users_db = {
    "officer1": {
        "username": "officer1",
        "password": "admin123",
        "role": "official"
    },
    "officer2": {
        "username": "officer2",
        "password": "gov12345",
        "role": "official"
    }
}


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def generate_complaint_id():
    return "HYD-" + uuid.uuid4().hex[:8].upper()


def authenticate_user(username: str, password: str):
    user = fake_users_db.get(username)
    if not user:
        return None
    if user["password"] != password:
        return None
    return user


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=60))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = fake_users_db.get(username)
    if user is None:
        raise credentials_exception
    return user


@app.get("/")
def root():
    return {"message": "API is running"}


@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    access_token = create_access_token(
        data={"sub": user["username"], "role": user["role"]},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "username": user["username"],
        "role": user["role"]
    }


@app.get("/me")
def read_me(current_user: dict = Depends(get_current_user)):
    return current_user


@app.post("/complaints", response_model=ComplaintResponse)
def create_complaint(payload: ComplaintCreate, db: Session = Depends(get_db)):
    category = predict_category(payload.description)
    department = map_department(category)
    zone = map_zone(payload.address or "")

    if zone == "Outside Hyderabad / Unknown":
        raise HTTPException(
            status_code=400,
            detail="Currently this platform accepts complaints from Hyderabad locations only."
        )

    complaint = Complaint(
        id=generate_complaint_id(),
        citizen_name=payload.citizen_name,
        phone=payload.phone,
        email=payload.email,
        title=payload.title,
        description=payload.description,
        address=payload.address,
        maps_link=payload.maps_link,
        category=category,
        department=department,
        zone=zone,
        status="submitted",
    )

    db.add(complaint)
    db.commit()
    db.refresh(complaint)

    if payload.email:
        try:
            send_email(payload.email, complaint)
        except Exception as e:
            print(f"Error sending email: {e}")

    return complaint


@app.get("/complaints", response_model=list[ComplaintResponse])
def get_complaints(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    complaints = db.query(Complaint).order_by(Complaint.created_at.desc()).all()
    return complaints


@app.get("/complaints/{complaint_id}", response_model=ComplaintResponse)
def get_complaint_by_id(complaint_id: str, db: Session = Depends(get_db)):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()

    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    return complaint


@app.put("/complaints/{complaint_id}/status")
def update_status(
    complaint_id: str,
    status: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()

    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    complaint.status = status
    db.commit()
    db.refresh(complaint)

    return {"message": "Status updated", "status": complaint.status}