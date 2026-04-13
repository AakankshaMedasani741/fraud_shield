import type { Transaction } from '@/pages/index'

interface Props {
  result: Transaction | null
  loading: boolean
}

export default function ResultPanel({ result, loading }: Props) {
  return (
    <div className="card" style={{ minHeight: 320 }}>
      <h2 style={{ fontSize: 15, fontWeight: 600, color: '#c0c0e0', marginBottom: 20 }}>
        Detection result
      </h2>

      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, paddingTop: 40 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            border: '3px solid #2a2a45',
            borderTopColor: '#E24B4A',
            animation: 'spin 0.9s linear infinite'
          }} />
          <p style={{ color: '#7070a0', fontSize: 14 }}>Running fraud analysis…</p>
        </div>
      )}

      {!loading && !result && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, paddingTop: 40, color: '#4a4a6a' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2L4 6v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6l-8-4z"/>
          </svg>
          <p style={{ fontSize: 14, textAlign: 'center' }}>
            Fill in transaction details<br/>and click Analyze
          </p>
        </div>
      )}

      {!loading && result && (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Verdict badge */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: result.is_fraud ? '#2d1a1a' : '#1a2d1a',
              border: `3px solid ${result.is_fraud ? '#E24B4A' : '#639922'}`,
              margin: '0 auto 12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }} className={result.is_fraud ? 'pulse-fraud' : 'pulse-safe'}>
              {result.is_fraud
                ? <AlertIcon color="#E24B4A" />
                : <CheckIcon color="#639922" />}
            </div>
            <div style={{
              fontSize: 26, fontWeight: 700,
              color: result.is_fraud ? '#E24B4A' : '#639922',
              marginBottom: 6,
            }}>
              {result.is_fraud ? 'Fraudulent' : 'Legitimate'}
            </div>
            <span style={{
              background: result.is_fraud ? '#2d1a1a' : '#1a2d1a',
              border: `1px solid ${result.is_fraud ? '#5c2a2a' : '#2a5c2a'}`,
              borderRadius: 99, padding: '3px 14px',
              fontSize: 12, fontWeight: 600,
              color: result.is_fraud ? '#f09595' : '#97C459',
            }}>
              {result.verdict}
            </span>
          </div>

          {/* Risk score bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
              <span style={{ color: '#7070a0' }}>Risk score</span>
              <span style={{ fontWeight: 600, color: result.is_fraud ? '#E24B4A' : '#639922' }}>
                {result.risk_score}/100
              </span>
            </div>
            <div style={{ height: 10, background: '#0f0f1a', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${result.risk_score}%`,
                background: result.is_fraud
                  ? 'linear-gradient(90deg, #c03a39, #E24B4A)'
                  : 'linear-gradient(90deg, #3B6D11, #639922)',
                borderRadius: 99,
                transition: 'width 0.6s ease',
              }} />
            </div>
          </div>

          {/* Confidence */}
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            background: '#0f0f1a', borderRadius: 8, padding: '10px 14px',
            fontSize: 13,
          }}>
            <span style={{ color: '#7070a0' }}>Model confidence</span>
            <span style={{ fontWeight: 600, color: '#c0c0e0' }}>{result.confidence}%</span>
          </div>

          {/* Reason */}
          <div style={{
            background: '#0f0f1a', borderRadius: 8, padding: '12px 14px',
            borderLeft: `3px solid ${result.is_fraud ? '#E24B4A' : '#639922'}`,
            fontSize: 13, color: '#9090b0', lineHeight: 1.6,
          }}>
            {result.reason}
          </div>
        </div>
      )}
    </div>
  )
}

function AlertIcon({ color }: { color: string }) {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  )
}

function CheckIcon({ color }: { color: string }) {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}
