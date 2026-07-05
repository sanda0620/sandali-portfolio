'use client'
import { useEffect } from 'react'
import { Project } from '@/app/page'

const CAT_META: Record<string, { label: string; cls: string }> = {
  ml: { label: 'Machine Learning',   cls: 'c-ml' },
  de: { label: 'Data Engineering',   cls: 'c-de' },
  dv: { label: 'Data Visualization', cls: 'c-dv' },
  da: { label: 'Data Analysis',      cls: 'c-da' },
  wd: { label: 'Web Development',    cls: 'c-wd' },
}

export default function ProjectModal({ project: p, onClose }: { project: Project; onClose: () => void }) {
  const m = CAT_META[p.cat] || { label: p.cat, cls: 'c-ml' }
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', h) }
  }, [onClose])

  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{ position:'fixed',inset:0,zIndex:500,background:'rgba(0,0,0,0.72)',backdropFilter:'blur(10px)',display:'flex',alignItems:'center',justifyContent:'center',padding:'1.5rem' }}>
      <div style={{ background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:18,width:'min(720px,96vw)',maxHeight:'90vh',display:'flex',flexDirection:'column',overflow:'hidden',boxShadow:'0 28px 80px rgba(0,0,0,0.7)' }}>
        <div style={{ position:'relative',flexShrink:0 }}>
          {p.img ? <img src={p.img} alt={p.title} style={{ width:'100%',height:220,objectFit:'cover',display:'block' }} />
            : <div style={{ width:'100%',height:220,background:'var(--bg3)',display:'flex',alignItems:'center',justifyContent:'center' }}>
                <span className="syne" style={{ fontSize:'3rem',fontWeight:800,color:'var(--border-h)' }}>{m.label.split(' ').map((w:string)=>w[0]).join('')}</span>
              </div>}
          <button onClick={onClose} style={{ position:'absolute',top:12,right:12,width:32,height:32,borderRadius:'50%',background:'rgba(13,21,40,0.72)',backdropFilter:'blur(8px)',border:'1px solid rgba(255,255,255,0.15)',color:'#eef0f4',fontSize:'1rem',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center' }}>✕</button>
        </div>
        <div style={{ padding:'1.8rem',overflowY:'auto',flex:1 }}>
          <div style={{ display:'flex',alignItems:'center',gap:'0.7rem',marginBottom:'1rem',flexWrap:'wrap' }}>
            <span className="syne" style={{ fontSize:'0.72rem',color:'var(--txt3)',fontWeight:700 }}>{p.year}</span>
            <span style={{ padding:'0.22rem 0.65rem',borderRadius:999,background:'rgba(74,222,128,0.12)',color:'#4ade80',border:'1px solid rgba(74,222,128,0.25)',fontSize:'0.65rem',fontWeight:600 }}>Completed</span>
            <span className={`pcat ${m.cls}`}>{m.label}</span>
            {p.groupProject && <span style={{ padding:'0.2rem 0.6rem',borderRadius:999,background:'rgba(139,163,199,0.12)',color:'var(--accent2)',border:'1px solid rgba(139,163,199,0.2)',fontSize:'0.65rem',fontWeight:600 }}>Group Project</span>}
          </div>
          <div className="syne" style={{ fontSize:'1.4rem',fontWeight:700,color:'var(--txt)',marginBottom:'1.3rem',lineHeight:1.25 }}>{p.title}</div>
          <div style={{ fontSize:'0.65rem',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.15em',color:'var(--txt3)',marginBottom:'0.6rem' }}>Description</div>
          <div style={{ fontSize:'0.88rem',lineHeight:1.82,color:'var(--txt2)',marginBottom:'1.5rem' }} dangerouslySetInnerHTML={{ __html: p.description }} />
          <div style={{ fontSize:'0.65rem',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.15em',color:'var(--txt3)',marginBottom:'0.6rem' }}>Technologies</div>
          <div style={{ display:'flex',flexWrap:'wrap',gap:'0.4rem',marginBottom:'1.8rem' }}>
            {p.tags.map(t => <span key={t} style={{ padding:'0.25rem 0.65rem',background:'var(--surface)',border:'1px solid var(--border)',borderRadius:6,fontSize:'0.72rem',color:'var(--txt2)',fontFamily:'monospace' }}>{t}</span>)}
          </div>
          <div style={{ marginBottom:'1.8rem' }}>
            <div style={{ fontSize:'0.65rem',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.15em',color:'var(--txt3)',marginBottom:'0.4rem' }}>Completion</div>
            <div style={{ display:'flex',justifyContent:'space-between',fontSize:'0.78rem',color:'var(--txt2)',marginBottom:'0.4rem' }}><span/><span>100%</span></div>
            <div style={{ height:4,background:'rgba(255,255,255,0.07)',borderRadius:999,overflow:'hidden' }}>
              <div style={{ height:'100%',borderRadius:999,background:'linear-gradient(90deg,var(--accent2),var(--accent3))',width:'100%' }} />
            </div>
          </div>
          <div style={{ display:'flex',gap:'0.8rem',paddingTop:'1rem',borderTop:'1px solid var(--border)' }}>
            {p.gh && <a href={p.gh} target="_blank" rel="noopener noreferrer" className="btn-p" style={{ flex:1,justifyContent:'center' }}>View on GitHub</a>}
            <button onClick={onClose} className="btn-o">Close</button>
          </div>
        </div>
      </div>
    </div>
  )
}
