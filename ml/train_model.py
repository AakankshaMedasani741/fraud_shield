import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
from sklearn.preprocessing import LabelEncoder
import pickle
import os

print("🛡️  Fraud Shield — Model Training")
print("=" * 40)

np.random.seed(42)
n = 5000

merchant_types = ["Electronics", "Grocery", "Online retail", "Restaurant",
                  "Travel / airline", "ATM withdrawal", "Crypto exchange",
                  "Wire transfer", "Luxury goods"]
locations = ["Home city", "Domestic — different city", "International",
             "High-risk country", "Unknown / masked IP"]
times = ["Business hours (9 AM – 6 PM)", "Evening (6 PM – 11 PM)",
         "Late night (11 PM – 4 AM)", "Early morning (4 AM – 9 AM)"]
devices = ["Known personal device", "New / unrecognized device",
           "Mobile (rooted)", "VPN detected", "Shared/public device"]

merchant_risk = {m: i for i, m in enumerate(merchant_types)}
location_risk = {l: i for i, l in enumerate(locations)}
time_risk = {t: i for i, t in enumerate(times)}
device_risk = {d: i for i, d in enumerate(devices)}

amounts = np.random.exponential(scale=300, size=n)
amounts = np.clip(amounts, 1, 15000)

merch_idx = np.random.randint(0, len(merchant_types), n)
loc_idx   = np.random.randint(0, len(locations), n)
time_idx  = np.random.randint(0, len(times), n)
dev_idx   = np.random.randint(0, len(devices), n)

risk_score = (
    (amounts / 15000) * 30 +
    (merch_idx / (len(merchant_types) - 1)) * 25 +
    (loc_idx   / (len(locations) - 1))      * 20 +
    (time_idx  / (len(times) - 1))          * 15 +
    (dev_idx   / (len(devices) - 1))        * 10 +
    np.random.normal(0, 5, n)
)

labels = (risk_score > 45).astype(int)

df = pd.DataFrame({
    "amount":        amounts,
    "merchant_idx":  merch_idx,
    "location_idx":  loc_idx,
    "time_idx":      time_idx,
    "device_idx":    dev_idx,
    "is_fraud":      labels
})

X = df[["amount", "merchant_idx", "location_idx", "time_idx", "device_idx"]]
y = df["is_fraud"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestClassifier(n_estimators=100, max_depth=8, random_state=42)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
acc = accuracy_score(y_test, y_pred)
print(f"✅ Accuracy: {acc * 100:.2f}%")
print("\nClassification Report:")
print(classification_report(y_test, y_pred, target_names=["Legitimate", "Fraud"]))

meta = {
    "merchant_types": merchant_types,
    "locations": locations,
    "times": times,
    "devices": devices
}

os.makedirs("model", exist_ok=True)
with open("model/fraud_model.pkl", "wb") as f:
    pickle.dump(model, f)
with open("model/meta.pkl", "wb") as f:
    pickle.dump(meta, f)

print("\n✅ Model saved to ml/model/fraud_model.pkl")
print("✅ Meta saved  to ml/model/meta.pkl")
print("\nRun the backend next: cd ../backend && uvicorn main:app --reload")
