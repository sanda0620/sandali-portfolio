'use client'
import { Settings } from '@/app/page'

export default function About({ settings }: { settings: Settings }) {
  const pills = ['Python','R','SQL','Kafka','Power BI','Spring Boot','Docker','React','scikit-learn','PostgreSQL','MongoDB','SSIS','SSAS','Grafana','JWT','GitHub Actions']

  return (
    <div id="about">
      <div className="section-wrap">
        <div className="sec-hd">
          <div className="sec-eye">About Me</div>
          <h2>Who I Am</h2>
        </div>
        <div className="about-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: '3rem', alignItems: 'start' }}>
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
              {pills.map(p => <span key={p} className="pill">{p}</span>)}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginTop: '1.2rem' }}>
              {[
                ['University','SLIIT, Sri Lanka'],
                ['Degree','BSc. (Hons) IT — Data Science'],
                ['Location','Colombo, Sri Lanka'],
                ['Phone','+94 71 074 3784'],
              ].map(([label, val]) => (
                <div key={label} className="gc" style={{ padding: '0.75rem 0.9rem' }}>
                  <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--txt3)', marginBottom: '0.18rem' }}>{label}</div>
                  <div style={{ fontSize: '0.83rem', fontWeight: 500, color: 'var(--txt)' }}>{val}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.85, color: 'var(--txt2)', marginBottom: '0.9rem' }}>
              I'm a Data Science undergraduate at SLIIT who builds systems that make data actually useful — not just analysed, but engineered, visualised, and deployed. From streaming <strong style={{ color: 'var(--accent3)' }}>1 event per second</strong> through a Kafka pipeline into PostgreSQL, to training a Random Forest that achieved <strong style={{ color: 'var(--accent3)' }}>ROC-AUC 0.728</strong> across 300,000 ad campaign records — I care about the output as much as the insight.
            </p>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.85, color: 'var(--txt2)', marginBottom: '0.9rem' }}>
              My work lives at the intersection of data engineering, machine learning, and business intelligence. I've built end-to-end ETL pipelines with star schema warehouses, Power BI dashboards for executive reporting, statistical models in R for healthcare survey data, and a full-stack campus management system with OAuth 2.0, MFA, and real-time SSE notifications.
            </p>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.7, color: 'var(--accent)', fontStyle: 'italic', borderLeft: '2px solid var(--border-h)', paddingLeft: '0.85rem', marginTop: '0.5rem' }}>
              "I don't just explore data — I engineer systems that put it to work."
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
