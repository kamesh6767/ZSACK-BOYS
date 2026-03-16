import sys
import os
import uuid
import random
from datetime import datetime, timedelta

# Add the current directory to sys.path to import local modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal, engine
import models

def seed_database():
    db = SessionLocal()
    try:
        # 1. Create Example Datasets
        datasets = [
            {
                "id": "ds_001",
                "name": "PM-KISAN_North_Region_Q1.csv",
                "records_count": 1500,
                "status": "Analyzed",
                "fraud_found_count": 42,
                "scheme_type": "Agricultural Subsidy"
            },
            {
                "id": "ds_002",
                "name": "MGNREGA_Payroll_Audit_Feb.xlsx",
                "records_count": 2800,
                "status": "Analyzed",
                "fraud_found_count": 128,
                "scheme_type": "Employment Guarantee"
            },
            {
                "id": "ds_003",
                "name": "PMAY_Housing_Allotment_2024.csv",
                "records_count": 950,
                "status": "Under Investigation",
                "fraud_found_count": 15,
                "scheme_type": "Housing Scheme"
            },
            {
                "id": "ds_004",
                "name": "Ayushman_Bharat_Claims_V4.json",
                "records_count": 5200,
                "status": "Processing",
                "fraud_found_count": 0,
                "scheme_type": "Healthcare Healthcare"
            }
        ]

        for ds_data in datasets:
            # Check if exists
            existing = db.query(models.Dataset).filter(models.Dataset.id == ds_data["id"]).first()
            if not existing:
                dataset = models.Dataset(**ds_data)
                db.add(dataset)
                print(f"Added dataset: {ds_data['name']}")

        db.commit()

        # 2. Create Example Beneficiaries for the first two datasets
        beneficiary_names = [
            "Rajesh Kumar", "Anita Sharma", "Suresh Patel", "Priya Singh", 
            "Vikram Mohanty", "Sunita Reddy", "Amit Verma", "Meena Kumari",
            "Sanjay Gupta", "Deepa Nair", "Rahul Deshmukh", "Kavita Rao"
        ]
        
        locations = ["Mumbai, MH", "Delhi, DL", "Bangalore, KA", "Hyderabad, TS", "Chennai, TN", "Kolkata, WB"]
        fraud_types = [
            "Shared Bank Account", "Duplicate National ID", "Income Mismatch", 
            "Ghost Beneficiary", "Geographic Anomaly", "Splitting Claims"
        ]

        # Add 20 diverse beneficiaries
        for i in range(20):
            ds_id = "ds_001" if i < 10 else "ds_002"
            risk_score = random.uniform(10, 95)
            status = "Pending"
            fraud_type = None
            
            if risk_score > 80:
                status = "Confirmed Fraud"
                fraud_type = random.choice(fraud_types)
            elif risk_score > 50:
                status = "Under Investigation"
                fraud_type = random.choice(fraud_types)
            elif risk_score > 30:
                status = "Cleared"
            
            beneficiary = models.Beneficiary(
                id=str(uuid.uuid4())[:8],
                name=random.choice(beneficiary_names),
                address=f"House {random.randint(1, 400)}, Sector {random.randint(1, 20)}",
                phone=f"+91 {random.randint(7000, 9999)}{random.randint(100000, 999999)}",
                bank_account=f"ACC{random.randint(10000000, 99999999)}",
                national_id=f"NID-{random.randint(1000, 9999)}-{random.randint(1000, 9999)}",
                scheme_type="Agricultural Subsidy" if ds_id == "ds_001" else "Employment Guarantee",
                claim_amount=float(random.randint(5000, 50000)),
                location=random.choice(locations),
                risk_score=risk_score,
                fraud_type=fraud_type,
                status=status,
                dataset_id=ds_id
            )
            db.add(beneficiary)
            
            # If high risk, also add an alert
            if risk_score > 70:
                alert = models.Alert(
                    type="critical" if risk_score > 90 else "high",
                    title=f"Anomaly Alert: {beneficiary.name}",
                    message=f"High risk score ({risk_score:.1f}%) detected. Reason: {fraud_type or 'Complex pattern mismatch'}.",
                    created_at=datetime.utcnow() - timedelta(hours=random.randint(1, 72))
                )
                db.add(alert)

        db.commit()
        print("Successfully seeded 20 beneficiaries and 4 datasets.")

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    # Ensure tables exist
    models.Base.metadata.create_all(bind=engine)
    seed_database()
