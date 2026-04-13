interface Props {
  total: number
  fraud: number
  safe:  number
}

export default function StatsBar({ total, fraud, safe }: Props) {
  const fraudPct = total > 0 ? Math.round((fraud / total) * 100) : 0

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
      {[
        { label: 'Total analyzed',  value: total,      color: '#c0c0e0' },
        { label: 'Fraud detected',  value: fraud,      color: '#E24B4A' },
        { label: 'Safe',            value: safe,       color: '#639922' },
        { label: 'Fraud rate',      value: `${fraudPct}%`, color: fraudPct > 50 ? '#E24B4A' : '#639922' },
      ].map(s => (
        <div key={s.label} style={{
          background: '#1a1a2e',
          border: '1px solid #2a2a45',
          borderRadius: 10,
          padding: '14px 16px',
        }}>
          <div style={{ fontSize: 11, color: '#5a5a7a', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {s.label}
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: s.color, fontVariantNumeric: 'tabular-nums' }}>
            {s.value}
          </div>
        </div>
      ))}
    </div>
  )
}
