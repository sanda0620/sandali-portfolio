'use client'
import { Project } from '@/app/page'

const CORE_TECHS = new Set(['Python','R','Java','JavaScript','SQL','Spring Boot','React','Vue','Angular',
  'Node.js','Apache Kafka','Docker','Kubernetes','GitHub Actions','PostgreSQL','MySQL','MongoDB','Redis',
  'Power BI','Tableau','Grafana','scikit-learn','TensorFlow','PyTorch','pandas','numpy','dplyr','ggplot2',
  'matplotlib','seaborn','SQLAlchemy','ETL','Star Schema','REST API','OAuth 2.0','JWT','Vite','Recharts'])

export default function KpiCards({ projects }: { projects: Project[] }) {
  const cats       = new Set(projects.map(p => p.cat))
  const coreTechs  = new Set(projects.flatMap(p => p.tags).filter(t => CORE_TECHS.has(t)))
  const techCount  = Math.max(20, coreTechs.size)
  const largestDS  = projects.reduce((max, p) => Math.max(max, p.dataScale || 0), 0)
  const largestFmt = largestDS >= 1000 ? Math.floor(largestDS / 1000) + 'K+' : largestDS > 0 ? largestDS + '+' : '100K+'

  const cards = [
    { icon: '</>', label: 'Total Projects',      val: String(projects.length), sub: `Across ${cats.size} categories`, cls: 'i1' },
    { icon: 'Tx',  label: 'Technologies',         val: techCount + '+',          sub: `Across ${cats.size} domains`,   cls: 'i3' },
    { icon: 'DB',  label: 'Largest Dataset',      val: largestFmt,               sub: 'Social media ML model',         cls: 'i4' },
    { icon: 'IoT', label: 'Pipeline Throughput',  val: '1/sec',                  sub: 'Kafka IoT streaming',           cls: 'i5' },
  ]

  return (
    <div style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '1.8rem 2.5rem', transition: 'background 0.35s' }}>
      <div className="kpi-inner" style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem' }}>
        {cards.map((c, i) => (
          <div key={i} className="gc" style={{ padding: '1.1rem 1.2rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(139,163,199,0.15)', color: 'var(--accent)',
                fontSize: '0.7rem', fontWeight: 700, fontFamily: 'Syne, sans-serif',
              }}>{c.icon}</div>
              <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#4ade80', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>↗ Active</span>
            </div>
            <div className="syne" style={{ fontSize: '1.55rem', fontWeight: 700, color: 'var(--txt)', letterSpacing: '-0.5px', lineHeight: 1, marginTop: '0.2rem' }}>{c.val}</div>
            <div style={{ fontSize: '0.72rem', fontWeight: 500, color: 'var(--txt2)' }}>{c.label}</div>
            <div style={{ fontSize: '0.66rem', color: 'var(--accent)', marginTop: '0.1rem' }}>{c.sub}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
