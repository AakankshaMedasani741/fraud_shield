import { useState } from 'react'
import type { FormData } from '@/pages/index'

const MERCHANTS = [
  'Electronics', 'Grocery', 'Online retail', 'Restaurant',
  'Travel / airline', 'ATM withdrawal', 'Crypto exchange',
  'Wire transfer', 'Luxury goods',
]
const LOCATIONS = [
  'Home city', 'Domestic — different city', 'International',
  'High-risk country', 'Unknown / masked IP',
]
const TIMES = [
  'Business hours (9 AM – 6 PM)', 'Evening (6 PM – 11 PM)',
  'Late night (11 PM – 4 AM)', 'Early morning (4 AM – 9 AM)',
]
const DEVICES = [
  'Known personal device', 'New / unrecognized device',
  'Mobile (rooted)', 'VPN detected', 'Shared/public device',
]

interface Props {
  onAnalyze: (data: FormData) => void
  loading: boolean
}

const SAMPLE_TRANSACTIONS = [
  { label: '🔴 High risk', data: { amount: '8500', merchant: 'Crypto exchange', location: 'High-risk country', time: 'Late night (11 PM – 4 AM)', device: 'VPN detected' }},
  { label: '🟢 Low risk',  data: { amount: '42',   merchant: 'Grocery',         location: 'Home city',         time: 'Business hours (9 AM – 6 PM)', device: 'Known personal device' }},
  { label: '🟡 Medium',    data: { amount: '1250',  merchant: 'Online retail',   location: 'Domestic — different city', time: 'Evening (6 PM – 11 PM)', device: 'New / unrecognized device' }},
]

export default function TransactionForm({ onAnalyze, loading }: Props) {
  const [form, setForm] = useState<FormData>({
    amount: '', merchant: '', location: '', time: '', device: '',
  })

  const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const valid = form.amount && form.merchant && form.location && form.time && form.device

  const loadSample = (data: FormData) => setForm(data)

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-5">
        <h2 style={{ fontSize: 15, fontWeight: 600, color: '#c0c0e0' }}>
          Transaction details
        </h2>
        <div className="flex gap-2">
          {SAMPLE_TRANSACTIONS.map(s => (
            <button
              key={s.label}
              onClick={() => loadSample(s.data as FormData)}
              style={{
                background: '#0f0f1a', border: '1px solid #2a2a45',
                borderRadius: 6, padding: '3px 8px',
                fontSize: 11, color: '#7070a0', cursor: 'pointer'
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label style={{ fontSize: 13, color: '#7070a0', display: 'block', marginBottom: 6 }}>
          Amount (USD)
        </label>
        <input
          className="input-field"
          type="number"
          placeholder="e.g. 1250.00"
          value={form.amount}
          onChange={set('amount')}
          min="0"
        />
      </div>

      {([
        ['merchant', 'Merchant type',   MERCHANTS],
        ['location', 'Location',        LOCATIONS],
        ['time',     'Time of transaction', TIMES],
        ['device',   'Device type',     DEVICES],
      ] as [keyof FormData, string, string[]][]).map(([key, label, opts]) => (
        <div key={key} className="mb-4">
          <label style={{ fontSize: 13, color: '#7070a0', display: 'block', marginBottom: 6 }}>
            {label}
          </label>
          <select className="input-field" value={form[key]} onChange={set(key)}>
            <option value="">Select {label.toLowerCase()}</option>
            {opts.map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
      ))}

      <button
        className="btn-primary mt-2"
        disabled={!valid || loading}
        onClick={() => onAnalyze(form)}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <SpinIcon /> Analyzing transaction…
          </span>
        ) : 'Analyze transaction →'}
      </button>
    </div>
  )
}

function SpinIcon() {
  return (
    <svg className="spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="12" cy="12" r="10" strokeDasharray="31" strokeDashoffset="10" />
    </svg>
  )
}
