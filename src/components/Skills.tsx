'use client'
import { Certificate, Settings } from '@/app/page'

const LEVEL_MAP: Record<string, { cls: string; label: string }> = {
  expert:       { cls: 'sb-expert',       label: 'Expert' },
  advanced:     { cls: 'sb-advanced',     label: 'Advanced' },
  intermediate: { cls: 'sb-intermediate', label: 'Intermediate' },
  beginner:     { cls: 'sb-beginner',     label: 'Beginner' },
}

const DEFAULT_SKILLS = {
  lang: [
    { name: 'Python (pandas, numpy, scikit-learn)', level: 'expert' },
    { name: 'R (dplyr, ggplot2, statistics)',       level: 'advanced' },
    { name: 'SQL / PostgreSQL / SQL Server',        level: 'expert' },
    { name: 'Java / Spring Boot / REST APIs',       level: 'intermediate' },
    { name: 'React.js / JavaScript / Node.js',      level: 'intermediate' },
  ],
  data: [
    { name: 'ETL / SSIS / SSAS / Star Schema', level: 'advanced' },
    { name: 'Apache Kafka (streaming)',         level: 'advanced' },
    { name: 'Power BI / Grafana',              level: 'advanced' },
    { name: 'Docker / GitHub Actions CI/CD',   level: 'intermediate' },
    { name: 'Machine Learning (RF, Regression)', level: 'advanced' },
  ],
}

export default function Skills({ certs, settings, onSelectCert }: {
  certs: Certificate[]
  settings: Settings
  onSelectCert: (c: Certificate) => void
}) {
  const skills = settings.skills || DEFAULT_SKILLS

  return (
    <div id="skills">
      <div className="section-wrap">
        <div className="sec-hd">
          <div className="sec-eye">Expertise</div>
          <h2>Skills & Tools</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }} className="sk-grid">
          {(['lang', 'data'] as const).map(group => (
            <div key={group} className="gc" style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '0.67rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--txt3)', marginBottom: '1.1rem' }}>
                {group === 'lang' ? 'Languages & Frameworks' : 'Data & Infrastructure'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {skills[group].map((s: any) => {
                  const lv = LEVEL_MAP[s.level] || LEVEL_MAP.beginner
                  return (
                    <div key={s.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--txt2)', flex: 1 }}>{s.name}</span>
                      <span className={`sb-badge ${lv.cls}`}>{lv.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}

          {/* Certs — full width */}
          <div className="gc" style={{ padding: '1.5rem', gridColumn: 'span 2' }}>
            <div style={{ fontSize: '0.67rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--txt3)', marginBottom: '0.75rem' }}>Certifications</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {certs.length === 0 ? (
                ['MongoDB Data Modeling Path · MongoDB University · 2026',
                 'MongoDB Basics for Students · MongoDB University · 2026',
                 'MongoDB Indexes · MongoDB University · 2026'].map(name => (
                  <span key={name} className="cert-item">{name}</span>
                ))
              ) : certs.map(c => (
                <span key={c._id} className="cert-item" onClick={() => onSelectCert(c)}>
                  {c.name}{c.issuer ? ` · ${c.issuer}` : ''}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
