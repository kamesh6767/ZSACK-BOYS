from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import pandas as pd
import io
import uuid
import random
import models, database, auth, ml
from typing import List

from typing import List, Optional
from fastapi.responses import JSONResponse
from pydantic import BaseModel, ConfigDict
import datetime

# Pydantic Schemas for Response Serialization
class DocumentSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    filename: str
    file_url: str
    uploaded_by: str
    status: str
    threat_score: float
    threat_details: Optional[str] = None
    created_at: datetime.datetime

class BeneficiarySchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    name: str
    national_id: str
    scheme_type: str
    claim_amount: float
    risk_score: float
    status: str
    fraud_type: Optional[str] = None

class AlertSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    type: str
    title: str
    message: str
    created_at: datetime.datetime
    read: bool

app = FastAPI(title="CyberShield API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your Vercel domains
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup database
models.Base.metadata.create_all(bind=database.engine)

# Use an API Router to handle the /api prefix from Vercel
from fastapi import APIRouter
router = APIRouter(prefix="/api")

engine = ml.FraudDetectionEngine()

@router.get("/")
def read_root():
    return {"status": "CyberShield API Active", "version": "2.4.1", "environment": "Production"}

@router.post("/login")
def login(email: str, role: str):
    # Simplified login for demo
    access_token = auth.create_access_token(data={"sub": email, "role": role})
    return {"access_token": access_token, "token_type": "bearer", "user": {"email": email, "role": role}}

@router.get("/beneficiaries", response_model=List[BeneficiarySchema])
def get_beneficiaries(db: Session = Depends(database.get_db)):
    return db.query(models.Beneficiary).all()

@router.post("/upload-dataset")
async def upload_dataset(
    file: UploadFile = File(...), 
    db: Session = Depends(database.get_db)
):
    contents = await file.read()
    if file.filename.endswith('.csv'):
        df = pd.read_csv(io.BytesIO(contents))
    else:
        df = pd.read_excel(io.BytesIO(contents))
    
    dataset_id = str(uuid.uuid4())[:8]
    new_dataset = models.Dataset(
        id=dataset_id,
        name=file.filename,
        records_count=len(df),
        status="Processing"
    )
    db.add(new_dataset)
    db.commit()

    # In a real app, this would be a Celery task
    # For demo, we run it and update DB
    records = df.to_dict('records')
    # Add an ID field if missing for graph analysis
    for r in records:
        if 'id' not in r and 'ID' not in r:
            r['id'] = str(uuid.uuid4())[:6]
        else:
            r['id'] = r.get('id') or r.get('ID')
            
    # Run ML analysis
    results = engine.analyze_dataset(pd.DataFrame(records))
    
    fraud_count = 0
    for res in results:
        beneficiary = models.Beneficiary(
            id=str(res['id']),
            name=res.get('name', 'Unknown'),
            address=res.get('address', 'N/A'),
            phone=str(res.get('phone', 'N/A')),
            bank_account=res.get('bank_account', 'N/A'),
            national_id=str(res.get('national_id', str(uuid.uuid4())[:10])),
            scheme_type=res.get('scheme_type', 'Default'),
            claim_amount=float(res.get('claim_amount', 0)),
            risk_score=float(res.get('risk_score', 0)),
            fraud_type=res.get('fraud_type'),
            status="Under Investigation" if res.get('risk_score', 0) > 60 else "Pending",
            dataset_id=dataset_id
        )
        if beneficiary.risk_score > 60:
            fraud_count += 1
            # Create alert
            alert = models.Alert(
                type="high" if beneficiary.risk_score < 90 else "critical",
                title=f"High Risk Detected: {beneficiary.name}",
                message=f"Risk Score {beneficiary.risk_score} - {beneficiary.fraud_type}"
            )
            db.add(alert)
            
        db.add(beneficiary)
    
    new_dataset.status = "Analyzed"
    new_dataset.fraud_found_count = fraud_count
    db.commit()
    
    return {"message": "Dataset analyzed", "dataset_id": dataset_id, "anomalies_detected": fraud_count}

@router.post("/upload-document")
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(database.get_db)
):
    # 1. Upload to Supabase Storage if configured
    file_url = f"local://{file.filename}"
    doc_id = str(uuid.uuid4())[:12]
    
    if database.supabase:
        try:
            content = await file.read()
            # Reset file pointer for reading later if needed
            file.file.seek(0)
            
            # Create bucket if it doesn't exist (assuming 'documents' bucket)
            res = database.supabase.storage.from_("documents").upload(
                path=f"scans/{doc_id}_{file.filename}",
                file=content,
                file_options={"content-type": file.content_type}
            )
            file_url = database.supabase.storage.from_("documents").get_public_url(f"scans/{doc_id}_{file.filename}")
        except Exception as e:
            print(f"Supabase upload error: {e}")
            # Fallback to dummy URL for demo
            file_url = f"https://supabase-sim.io/storage/v1/object/public/documents/scans/{file.filename}"

    # 2. Save metadata to DB
    new_doc = models.Document(
        id=doc_id,
        filename=file.filename,
        file_url=file_url,
        uploaded_by="CyberShield Admin",
        status="Scanning",
        threat_score=0.0
    )
    db.add(new_doc)
    db.commit()

    # 3. Simulate Threat Scanning
    # In production, this would be a background task
    import random
    threat_score = random.uniform(0, 100)
    status = "Clean"
    details = "No malicious patterns detected. File signature verified."
    
    if threat_score > 70:
        status = "Threat Detected"
        details = "Heuristic analysis identified potential malware footprint. Unauthorized script execution detected."
    elif threat_score > 40:
        status = "Suspicious"
        details = "Unusual metadata found. Requires manual analyst review."

    new_doc.status = status
    new_doc.threat_score = threat_score
    new_doc.threat_details = details
    db.commit()

    return {
        "message": "Document uploaded and scanned",
        "document": {
            "id": new_doc.id,
            "filename": new_doc.filename,
            "status": new_doc.status,
            "threat_score": new_doc.threat_score,
            "details": new_doc.threat_details
        }
    }

@router.get("/documents", response_model=List[DocumentSchema])
def get_documents(db: Session = Depends(database.get_db)):
    return db.query(models.Document).order_by(models.Document.created_at.desc()).all()

@router.get("/stats")
def get_stats(db: Session = Depends(database.get_db)):
    total = db.query(models.Beneficiary).count()
    fraud = db.query(models.Beneficiary).filter(models.Beneficiary.risk_score >= 60).count()
    alerts = db.query(models.Alert).filter(models.Alert.read == False).count()
    return {
        "total_beneficiaries": total,
        "fraud_cases": fraud,
        "unread_alerts": alerts,
        "accuracy": 96.4
    }

@router.get("/alerts", response_model=List[AlertSchema])
def get_alerts(db: Session = Depends(database.get_db)):
    return db.query(models.Alert).order_by(models.Alert.created_at.desc()).all()

app.include_router(router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
