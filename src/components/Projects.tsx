'use client'
import { useState, useEffect, useRef } from 'react'
import { Project } from '@/app/page'

const CAT_META: Record<string, { label: string; cls: string }> = {
  ml: { label: 'Machine Learning',   cls: 'c-ml' },
  de: { label: 'Data Engineering',   cls: 'c-de' },
  dv: { label: 'Data Visualization', cls: 'c-dv' },
  da: { label: 'Data Analysis',      cls: 'c-da' },
  wd: { label: 'Web Development',    cls: 'c-wd' },
}

export default function Projects({ projects, onSelectProject }: {
  projects: Project[]
  onSelectProject: (p: Project) => void
}) {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const visible = projects.filter(p => {
    const catOk = filter === 'all' ? p.featured : p.cat === filter
    const q = search.trim().toLowerCase()
    const searchOk = !q || [p.title, ...p.tags, p.description].some(s => s?.toLowerCase().includes(q))
    return catOk && searchOk
  })

  return (
    <div className="section-alt" id="projects">
      <div className="section-wrap">
        <div className="sec-hd">
          <div className="sec-eye">Work</div>
          <h2>Projects</h2>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: '1.2rem' }}>
          <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--txt3)', fontSize: '0.85rem' }}>⌕</span>
          <input
            className="search-input"
            placeholder="Search projects by name or technology..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--txt3)', fontSize: '0.85rem' }}>✕</button>
          )}
        </div>

        {/* Filter buttons */}
        <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {['all', 'ml', 'de', 'dv', 'da', 'wd'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '0.3rem 0.9rem',
              border: `1px solid ${filter === f ? 'transparent' : 'var(--border)'}`,
              borderRadius: 6,
              background: filter === f ? 'var(--accent2)' : 'var(--surface)',
              color: filter === f ? '#eef0f4' : 'var(--txt2)',
              fontSize: '0.72rem', fontWeight: 500, cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif', transition: 'all 0.18s',
            }}>
              {f === 'all' ? 'All' : CAT_META[f]?.label}
            </button>
          ))}
        </div>

        <p style={{ fontSize: '0.72rem', color: 'var(--txt3)', marginBottom: '1rem' }}>
          Showing {visible.length} {filter === 'all' ? 'featured' : ''} project{visible.length !== 1 ? 's' : ''}
          {filter === 'all' ? ` of ${projects.length} total` : ''}
        </p>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(295px,1fr))', gap: '1.2rem' }}>
          {visible.map(p => (
            <ProjectCard key={p._id} project={p} onClick={() => onSelectProject(p)} />
          ))}
        </div>

        {visible.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2.5rem', fontSize: '0.85rem', color: 'var(--txt3)' }}>
            No projects match your search.
          </div>
        )}
      </div>
    </div>
  )
}

function ProjectCard({ project: p, onClick }: { project: Project; onClick: () => void }) {
  const m = CAT_META[p.cat] || { label: p.cat, cls: 'c-ml' }
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.08 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      onClick={onClick}
      style={{
        background: 'var(--glass)',
        border: '1px solid var(--border)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: 14,
        boxShadow: 'var(--shadow2), var(--inset)',
        transition: 'opacity 0.48s ease, transform 0.48s ease, border-color 0.25s, box-shadow 0.25s',
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(18px)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--border-h)'
        e.currentTarget.style.transform = 'translateY(-3px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {/* Cover image */}
      {p.img ? (
        <img src={p.img} alt={p.title} style={{ width: '100%', height: 168, objectFit: 'cover', display: 'block', flexShrink: 0 }} />
      ) : (
        <div style={{
          width: '100%', height: 168, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--bg3)', flexShrink: 0, borderBottom: '1px solid var(--border)',
        }}>
          <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '2.5rem', fontWeight: 800, color: 'var(--border-h)', letterSpacing: -1 }}>
            {m.label.split(' ').map((w: string) => w[0]).join('')}
          </span>
        </div>
      )}

      {/* Card body */}
      <div style={{ padding: '1.1rem 1.2rem 1.2rem', display: 'flex', flexDirection: 'column', gap: '0.7rem', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className={`pcat ${m.cls}`}>{m.label}</span>
          <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '0.65rem', color: 'var(--txt3)', fontWeight: 600 }}>{p.year}</span>
        </div>

        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '0.95rem', fontWeight: 600, color: 'var(--txt)', lineHeight: 1.3 }}>
          {p.title}
          {p.groupProject && (
            <span style={{ marginLeft: 6, padding: '0.18rem 0.55rem', borderRadius: 999, background: 'rgba(139,163,199,0.12)', color: 'var(--accent2)', border: '1px solid rgba(139,163,199,0.2)', fontSize: '0.58rem', fontWeight: 600 }}>Group</span>
          )}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
          {p.tags.slice(0, 4).map(t => (
            <span key={t} style={{ padding: '0.16rem 0.5rem', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: 4, fontSize: '0.65rem', color: 'var(--txt3)', fontFamily: 'monospace' }}>{t}</span>
          ))}
          {p.tags.length > 4 && (
            <span style={{ padding: '0.16rem 0.5rem', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: 4, fontSize: '0.65rem', color: 'var(--txt3)', fontFamily: 'monospace' }}>+{p.tags.length - 4}</span>
          )}
        </div>

        <div style={{ fontSize: '0.65rem', color: 'var(--txt3)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: 'auto', paddingTop: '0.5rem' }}>
          <span style={{ width: 14, height: 1, background: 'var(--border)', display: 'block' }} />
          Click to view details
        </div>
      </div>
    </div>
  )
}
