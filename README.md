# 🛡️ Fraud Shield — AI Transaction Fraud Detector

A full-stack ML-powered web app that detects fraudulent transactions.
Built with **Next.js + Tailwind CSS** (frontend), **FastAPI** (backend), and **scikit-learn Random Forest** (ML model).

---

## 📁 Project Structure

```
fraud-shield/
├── ml/                    ← Python ML model
│   ├── train_model.py     ← Train & export the model
│   ├── requirements.txt
│   └── model/             ← Auto-created after training
│       ├── fraud_model.pkl
│       └── meta.pkl
│
├── backend/               ← FastAPI REST API
│   ├── main.py
│   └── requirements.txt
│
└── frontend/              ← Next.js React app
    ├── src/
    │   ├── pages/
    │   │   ├── _app.tsx
    │   │   └── index.tsx
    │   ├── components/
    │   │   ├── TransactionForm.tsx
    │   │   ├── ResultPanel.tsx
    │   │   ├── StatsBar.tsx
    │   │   ├── HistoryLog.tsx
    │   │   └── FraudChart.tsx
    │   └── styles/
    │       └── globals.css
    ├── package.json
    ├── tailwind.config.js
    └── next.config.js
```

---

## ⚡ Quick Start (3 terminals in VS Code)

### Prerequisites
- Python 3.9+
- Node.js 18+
- npm or yarn

---

### Terminal 1 — Train the ML Model

```bash
cd ml
pip install -r requirements.txt
python train_model.py
```

You should see accuracy output and two `.pkl` files created in `ml/model/`.

---

### Terminal 2 — Start the Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

API will run at → http://localhost:8000
Swagger docs  → http://localhost:8000/docs

---

### Terminal 3 — Start the Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

App will run at → http://localhost:3000

---

## 🧪 Test the API directly

```bash
curl -X POST http://localhost:8000/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 8500,
    "merchant": "Crypto exchange",
    "location": "High-risk country",
    "time": "Late night (11 PM – 4 AM)",
    "device": "VPN detected"
  }'
```

Expected response:
```json
{
  "verdict": "FRAUD",
  "is_fraud": true,
  "risk_score": 91,
  "confidence": 93,
  "reason": "..."
}
```

---

## 🎯 Sample Test Cases

| Scenario        | Amount  | Merchant         | Location          | Time                      | Device                   | Expected |
|-----------------|---------|------------------|-------------------|---------------------------|--------------------------|----------|
| High fraud risk | $8,500  | Crypto exchange  | High-risk country | Late night (11 PM – 4 AM) | VPN detected             | 🔴 FRAUD |
| Low risk        | $42     | Grocery          | Home city         | Business hours            | Known personal device    | 🟢 SAFE  |
| Medium risk     | $1,250  | Online retail    | International     | Evening (6 PM – 11 PM)    | New / unrecognized device| 🟡 Varies|
| Wire fraud      | $12,000 | Wire transfer    | Unknown / masked IP | Early morning            | Shared/public device     | 🔴 FRAUD |

---

## 🚀 Deployment

### Frontend → Vercel
```bash
cd frontend
npm run build
# Push to GitHub, connect repo to vercel.com
```

### Backend → Render.com
1. Push backend folder to GitHub
2. Create a new Web Service on render.com
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add the model `.pkl` files to the repo before deploying

---

## 🧠 How it works

1. User fills in a transaction form (amount, merchant, location, time, device)
2. Frontend sends a POST request to `/api/predict`
3. FastAPI encodes the inputs and runs them through the Random Forest model
4. Model returns fraud probability → converted to verdict + risk score
5. Frontend displays the result with color-coded UI, history log, and chart

---

## 📊 Tech Stack

| Layer    | Tech                        |
|----------|-----------------------------|
| Frontend | Next.js 14, React, Tailwind |
| Charts   | Recharts                    |
| Backend  | FastAPI, Uvicorn            |
| ML Model | scikit-learn Random Forest  |
| Language | TypeScript + Python         |
