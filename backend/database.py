from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv()

# Default to SQLite for easy demo if PostgreSQL is not available
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./cybershield.db")

# Supabase Storage Configuration
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")

supabase: Client = None
if SUPABASE_URL and SUPABASE_KEY:
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Handle Supabase/PostgreSQL connection requirements
engine_args = {}
if "sqlite" in SQLALCHEMY_DATABASE_URL:
    engine_args["connect_args"] = {"check_same_thread": False}

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, **engine_args
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
