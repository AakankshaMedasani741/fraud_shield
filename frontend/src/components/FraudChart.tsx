import type { Transaction } from '@/pages/index'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts'

interface Props { history: Transaction[] }

export default function FraudChart({ history }: Props) {
  const recent = [...history].reverse().slice(-10)

  const data = recent.map((tx, i) => ({
    name: `#${history.length - recent.length + i + 1}`,
    'Risk score': tx.risk_score,
    type: tx.verdict,
  }))

  const summary = [
    { name: 'Safe',  value: history.filter(h => !h.is_fraud).length },
    { name: 'Fraud', value: history.filter(h =>  h.is_fraud).length },
  ]

  return (
    <div className="card">
      <h2 style={{ fontSize: 15, fontWeight: 600, color: '#c0c0e0', marginBottom: 16 }}>
        Risk scores — last {recent.length} transactions
      </h2>

      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a45" />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#5a5a7a' }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#5a5a7a' }} />
          <Tooltip
            contentStyle={{ background: '#1a1a2e', border: '1px solid #2a2a45', borderRadius: 8, fontSize: 13 }}
            labelStyle={{ color: '#c0c0e0' }}
          />
          <Bar dataKey="Risk score" radius={[4, 4, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.type === 'FRAUD' ? '#E24B4A' : '#639922'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div style={{ display: 'flex', gap: 16, marginTop: 14, justifyContent: 'center' }}>
        {summary.map(s => (
          <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
            <div style={{
              width: 10, height: 10, borderRadius: '50%',
              background: s.name === 'Fraud' ? '#E24B4A' : '#639922'
            }} />
            <span style={{ color: '#7070a0' }}>{s.name}:</span>
            <span style={{ fontWeight: 600, color: '#c0c0e0' }}>{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
