import type { Transaction } from '@/pages/index'

interface Props { history: Transaction[] }

export default function HistoryLog({ history }: Props) {
  return (
    <div className="card">
      <h2 style={{ fontSize: 15, fontWeight: 600, color: '#c0c0e0', marginBottom: 16 }}>
        Transaction history
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 300, overflowY: 'auto' }}>
        {history.map(tx => (
          <div key={tx.id} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: '#0f0f1a', borderRadius: 8, padding: '10px 12px',
            borderLeft: `3px solid ${tx.is_fraud ? '#E24B4A' : '#639922'}`,
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#c0c0e0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                ${tx.amount.toLocaleString()} — {tx.merchant}
              </div>
              <div style={{ fontSize: 11, color: '#5a5a7a', marginTop: 2 }}>
                Risk: {tx.risk_score}/100 · {tx.location} · {tx.timestamp}
              </div>
            </div>
            <span style={{
              background: tx.is_fraud ? '#2d1a1a' : '#1a2d1a',
              color: tx.is_fraud ? '#f09595' : '#97C459',
              border: `1px solid ${tx.is_fraud ? '#5c2a2a' : '#2a5c2a'}`,
              borderRadius: 99, padding: '2px 10px',
              fontSize: 11, fontWeight: 600, flexShrink: 0, marginLeft: 8
            }}>
              {tx.verdict}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
