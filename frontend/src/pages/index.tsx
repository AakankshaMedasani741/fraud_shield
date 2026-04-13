import Head from 'next/head'
import { useState } from 'react'
import TransactionForm from '@/components/TransactionForm'
import ResultPanel from '@/components/ResultPanel'
import StatsBar from '@/components/StatsBar'
import HistoryLog from '@/components/HistoryLog'
import FraudChart from '@/components/FraudChart'
import axios from 'axios'

export interface Transaction {
  id: number
  amount: number
  merchant: string
  location: string
  time: string
  device: string
  verdict: 'FRAUD' | 'SAFE'
  is_fraud: boolean
  risk_score: number
  confidence: number
  reason: string
  timestamp: string
}

export interface FormData {
  amount: string
  merchant: string
  location: string
  time: string
  device: string
}

export default function Home() {
  const [loading, setLoading]       = useState(false)
  const [result, setResult]         = useState<Transaction | null>(null)
  const [history, setHistory]       = useState<Transaction[]>([])
  const [error, setError]           = useState('')

  const handleAnalyze = async (formData: FormData) => {
    setLoading(true)
    setError('')
    try {
      const { data } = await axios.post('http://localhost:8000/api/predict', {
        amount:   parseFloat(formData.amount),
        merchant: formData.merchant,
        location: formData.location,
        time:     formData.time,
        device:   formData.device,
      })

      const tx: Transaction = {
        id:        Date.now(),
        ...formData,
        amount:    parseFloat(formData.amount),
        ...data,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setResult(tx)
      setHistory(prev => [tx, ...prev].slice(0, 20))
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Could not connect to backend. Is it running?')
    }
    setLoading(false)
  }

  const totalFraud = history.filter(h => h.is_fraud).length
  const totalSafe  = history.length - totalFraud

  return (
    <>
      <Head>
        <title>Fraud Shield — AI Transaction Detector</title>
        <meta name="description" content="ML-powered financial fraud detection" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen" style={{ background: '#0a0a16' }}>
        {/* Header */}
        <header style={{ background: '#1a1a2e', borderBottom: '1px solid #2a2a45' }}>
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-3">
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'linear-gradient(135deg,#E24B4A,#c03a39)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <ShieldIcon />
            </div>
            <div>
              <h1 className="font-bold text-lg" style={{ color: '#e8e8f0', letterSpacing: '-0.01em' }}>
                Fraud Shield
              </h1>
              <p style={{ fontSize: 12, color: '#7070a0' }}>
                AI-powered financial transaction fraud detection
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span style={{
                background: '#0f2d1a', border: '1px solid #1a5c2a',
                borderRadius: 99, padding: '3px 10px',
                fontSize: 12, color: '#4caf50', fontWeight: 500
              }}>
                ● Model online
              </span>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 py-8">
          <StatsBar total={history.length} fraud={totalFraud} safe={totalSafe} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Left column */}
            <div className="flex flex-col gap-6">
              <TransactionForm onAnalyze={handleAnalyze} loading={loading} />
              {error && (
                <div style={{
                  background: '#2d1a1a', border: '1px solid #5c2a2a',
                  borderRadius: 10, padding: '12px 16px',
                  color: '#f09595', fontSize: 14
                }}>
                  ⚠ {error}
                </div>
              )}
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-6">
              <ResultPanel result={result} loading={loading} />
            </div>
          </div>

          {/* Bottom row */}
          {history.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <HistoryLog history={history} />
              <FraudChart history={history} />
            </div>
          )}
        </main>
      </div>
    </>
  )
}

function ShieldIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
      <path d="M12 2L4 6v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6l-8-4z"/>
    </svg>
  )
}
