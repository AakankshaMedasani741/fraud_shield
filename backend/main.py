from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle
import numpy as np
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = os.path.join(os.path.dirname(__file__), "../ml/model/fraud_model.pkl")
META_PATH = os.path.join(os.path.dirname(__file__), "../ml/model/meta.pkl")

try:
    with open(MODEL_PATH, "rb") as f:
        model = pickle.load(f)
    with open(META_PATH, "rb") as f:
        meta = pickle.load(f)
    print("Model loaded")
except:
    model = None
    meta = None

class TransactionInput(BaseModel):
    amount: float
    merchant: str
    location: str
    time: str
    device: str

class PredictionOutput(BaseModel):
    verdict: str
    is_fraud: bool
    risk_score: int
    confidence: int
    reason: str

@app.get("/")
def root():
    return {"message": "running"}

@app.get("/health")
def health():
    return {"status": "ok", "model_loaded": model is not None}

@app.post("/api/predict", response_model=PredictionOutput)
def predict(tx: TransactionInput):
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded.")
    def enc(val, opts):
        try: return opts.index(val)
        except: return 0
    features = np.array([[tx.amount, enc(tx.merchant, meta["merchant_types"]), enc(tx.location, meta["locations"]), enc(tx.time, meta["times"]), enc(tx.device, meta["devices"])]])
    prediction = model.predict(features)[0]
    proba = model.predict_proba(features)[0]
    is_fraud = bool(prediction == 1)
    risk_score = int(round(float(proba[1]) * 100))
    confidence = int(round(max(proba) * 100))
    verdict = "FRAUD" if is_fraud else "SAFE"
    reason = f"Risk score {risk_score}/100 - {'fraudulent' if is_fraud else 'legitimate'} transaction detected."
    return PredictionOutput(verdict=verdict, is_fraud=is_fraud, risk_score=risk_score, confidence=confidence, reason=reason)