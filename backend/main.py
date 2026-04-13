from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle
import numpy as np
import os

app = FastAPI(title="Fraud Shield API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = os.path.join(os.path.dirname(__file__), "../ml/model/fraud_model.pkl")
META_PATH  = os.path.join(os.path.dirname(__file__), "../ml/model/meta.pkl")

try:
    with open(MODEL_PATH, "rb") as f:
        model = pickle.load(f)
    with open(META_PATH, "rb") as f:
        meta = pickle.load(f)
    print("✅ Model loaded successfully")
except FileNotFoundError:
    model = None
    meta = None
    print("⚠️  Model not found. Run ml/train_model.py first.")


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


def encode_feature(value: str, options: list) -> int:
    try:
        return options.index(value)
    except ValueError:
        return 0


RISK_REASONS = {
    (True,  "high_amount"):  "Unusually high transaction amount flagged.",
    (True,  "risky_device"): "Unrecognized or compromised device detected.",
    (True,  "risky_loc"):    "Transaction originated from a high-risk location.",
    (True,  "late_night"):   "Transaction occurred during high-risk hours.",
    (True,  "risky_merch"):  "Merchant category commonly associated with fraud.",
    (False, "default"):      "Transaction matches typical legitimate behaviour.",
}


@app.get("/")
def root():
    return {"message": "Fraud Shield API is running 🛡️"}


@app.get("/health")
def health():
    return {"status": "ok", "model_loaded": model is not None}


@app.post("/api/predict", response_model=PredictionOutput)
def predict(tx: TransactionInput):
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded. Run ml/train_model.py first.")

    merch_idx = encode_feature(tx.merchant, meta["merchant_types"])
    loc_idx   = encode_feature(tx.location, meta["locations"])
    time_idx  = encode_feature(tx.time,     meta["times"])
    dev_idx   = encode_feature(tx.device,   meta["devices"])

    features = np.array([[tx.amount, merch_idx, loc_idx, time_idx, dev_idx]])

    prediction   = model.predict(features)[0]
    proba        = model.predict_proba(features)[0]
    fraud_prob   = float(proba[1])
    is_fraud     = bool(prediction == 1)

    risk_score  = int(round(fraud_prob * 100))
    confidence  = int(round(max(proba) * 100))
    verdict     = "FRAUD" if is_fraud else "SAFE"

    # Build human-readable reason
    risky_devices   = ["New / unrecognized device", "Mobile (rooted)", "VPN detected", "Shared/public device"]
    risky_locs      = ["International", "High-risk country", "Unknown / masked IP"]
    risky_merchants = ["Crypto exchange", "Wire transfer", "ATM withdrawal", "Luxury goods"]
    late_times      = ["Late night (11 PM – 4 AM)", "Early morning (4 AM – 9 AM)"]

    if is_fraud:
        if tx.amount > 5000:
            reason = f"High-value transaction of ${tx.amount:,.2f} combined with risk factors triggered fraud detection."
        elif tx.device in risky_devices:
            reason = f"Device '{tx.device}' is associated with elevated fraud risk."
        elif tx.location in risky_locs:
            reason = f"Location '{tx.location}' is flagged as high-risk."
        elif tx.time in late_times:
            reason = f"Transactions during '{tx.time}' are statistically more likely to be fraudulent."
        elif tx.merchant in risky_merchants:
            reason = f"Merchant category '{tx.merchant}' has elevated fraud rates."
        else:
            reason = f"Multiple moderate risk signals combined to exceed fraud threshold ({risk_score}/100)."
    else:
        reason = f"Transaction profile matches typical legitimate behaviour. Risk score: {risk_score}/100."

    return PredictionOutput(
        verdict=verdict,
        is_fraud=is_fraud,
        risk_score=risk_score,
        confidence=confidence,
        reason=reason,
    )
