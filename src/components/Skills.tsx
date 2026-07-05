'use client'
import { useEffect, useState } from 'react'
import { Certificate, Settings } from '@/app/page'

const GITHUB_USERNAME = 'sanda0620' // change if needed

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

interface GithubStatsData {
  publicRepos: number | null
  contributions: number | null
  topLanguage: string | null
}

function GithubStats() {
  const [stats, setStats] = useState<GithubStatsData>({
    publicRepos: null,
    contributions: null,
    topLanguage: null,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        // 1. Public repo count
        const userRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`)
        if (!userRes.ok) throw new Error('user fetch failed')
        const userData = await userRes.json()

        // 2. Top language — aggregate across repos
        const reposRes = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`
        )
        if (!reposRes.ok) throw new Error('repos fetch failed')
        const repos = await reposRes.json()

        const langCounts: Record<string, number> = {}
        for (const repo of repos) {
          if (repo.language) {
            langCounts[repo.language] = (langCounts[repo.language] || 0) + 1
          }
        }
        const topLanguage =
          Object.entries(langCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null

        // 3. Contributions last year — via public contributions API (no auth needed)
        let contributions: number | null = null
        try {
          const contribRes = await fetch(
            `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`
          )
          if (contribRes.ok) {
            const contribData = await contribRes.json()
            contributions = contribData?.total?.lastYear ?? null
          }
        } catch {
          // non-fatal — leave contributions null, card will hide or show fallback
        }

        if (!cancelled) {
          setStats({
            publicRepos: userData.public_repos ?? null,
            contributions,
            topLanguage,
          })
          setLoading(false)
        }
      } catch {
        if (!cancelled) {
          setError(true)
          setLoading(false)
        }
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  const cardStyle: React.CSSProperties = {
    flex: 1,
    padding: '1.4rem 1rem',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
    alignItems: 'center',
    justifyContent: 'center',
  }
  const numberStyle: React.CSSProperties = {
    fontFamily: 'Syne,sans-serif',
    fontSize: '1.8rem',
    fontWeight: 700,
    color: 'var(--accent)',
  }
  const labelStyle: React.CSSProperties = {
    fontSize: '0.65rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    color: 'var(--txt3)',
  }

  if (error) return null // fail silently rather than showing broken cards

  return (
    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
      <div className="gc" style={cardStyle}>
        <span style={numberStyle}>
          {loading ? '—' : stats.publicRepos ?? '—'}
        </span>
        <span style={labelStyle}>Public Repos</span>
      </div>
      <div className="gc" style={cardStyle}>
        <span style={numberStyle}>
          {loading ? '—' : stats.contributions !== null ? `${stats.contributions}+` : '—'}
        </span>
        <span style={labelStyle}>Contributions · Last Year</span>
      </div>
      <div className="gc" style={cardStyle}>
        <span style={{ ...numberStyle, fontSize: '1.35rem' }}>
          {loading ? '—' : stats.topLanguage ?? '—'}
        </span>
        <span style={labelStyle}>Top Language</span>
      </div>
    </div>
  )
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

        <GithubStats />

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