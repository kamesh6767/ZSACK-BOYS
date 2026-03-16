from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship
from database import Base
import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    hashed_password = Column(String)
    role = Column(String) # Admin, Analyst, Field Officer
    is_active = Column(Boolean, default=True)

class Beneficiary(Base):
    __tablename__ = "beneficiaries"
    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    address = Column(String)
    phone = Column(String)
    bank_account = Column(String)
    national_id = Column(String, unique=True, index=True)
    scheme_type = Column(String)
    claim_amount = Column(Float)
    location = Column(String)
    risk_score = Column(Float, default=0.0)
    fraud_type = Column(String, nullable=True)
    status = Column(String, default="Pending") # Pending, Confirmed Fraud, False Positive, Under Investigation, Cleared
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    dataset_id = Column(String, ForeignKey("datasets.id"))
    dataset = relationship("Dataset", back_populates="beneficiaries")

class Dataset(Base):
    __tablename__ = "datasets"
    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    records_count = Column(Integer)
    upload_date = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(String, default="Uploaded") # Uploaded, Processing, Analyzed, Failed
    fraud_found_count = Column(Integer, default=0)
    scheme_type = Column(String)
    
    beneficiaries = relationship("Beneficiary", back_populates="dataset")

class Alert(Base):
    __tablename__ = "alerts"
    id = Column(Integer, primary_key=True, index=True)
    type = Column(String) # critical, high, medium, low
    title = Column(String)
    message = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    read = Column(Boolean, default=False)

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    action = Column(String)
    target = Column(String)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

class Document(Base):
    __tablename__ = "documents"
    id = Column(String, primary_key=True, index=True)
    filename = Column(String)
    file_url = Column(String) # Supabase Storage URL
    uploaded_by = Column(String)
    status = Column(String, default="Scanning") # Scanning, Clean, Threat Detected, Failed
    threat_score = Column(Float, default=0.0)
    threat_details = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
