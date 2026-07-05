'use client'
import { useEffect } from 'react'
import { Certificate } from '@/app/page'

export default function CertModal({ cert, onClose }: { cert: Certificate; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', h) }
  }, [onClose])

  const isImage = cert.fileType && (cert.fileType.startsWith('image/') || cert.fileType === 'image/url')
  const isPdf   = cert.fileType && cert.fileType.includes('pdf')

  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{ position:'fixed',inset:0,zIndex:700,background:'rgba(0,0,0,0.82)',backdropFilter:'blur(14px)',display:'flex',alignItems:'center',justifyContent:'center',padding:'1.5rem' }}>
      <div style={{ background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:18,width:'min(680px,96vw)',maxHeight:'92vh',display:'flex',flexDirection:'column',overflow:'hidden',boxShadow:'0 28px 80px rgba(0,0,0,0.75)' }}>
        {/* Header */}
        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'1rem 1.4rem',borderBottom:'1px solid var(--border)',flexShrink:0 }}>
          <span className="syne" style={{ fontSize:'0.9rem',fontWeight:600,color:'var(--txt)' }}>{cert.name}{cert.issuer ? ` — ${cert.issuer}` : ''}</span>
          <div style={{ display:'flex',gap:'0.6rem',alignItems:'center' }}>
            {cert.file && (
              <a href={cert.file} download={cert.name}
                style={{ padding:'0.35rem 0.85rem',background:'var(--accent)',color:'var(--bg)',border:'none',borderRadius:6,fontSize:'0.74rem',fontWeight:500,cursor:'pointer',textDecoration:'none' }}>
                Download
              </a>
            )}
            <button onClick={onClose} style={{ width:28,height:28,borderRadius:6,border:'1px solid var(--border)',background:'var(--surface)',color:'var(--txt2)',fontSize:'1rem',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center' }}>✕</button>
          </div>
        </div>
        {/* Body */}
        <div style={{ flex:1,overflow:'auto',display:'flex',alignItems:'center',justifyContent:'center',padding:cert.file&&isPdf?0:'1.2rem' }}>
          {!cert.file && (
            <div style={{ textAlign:'center',color:'var(--txt2)',padding:'2rem' }}>
              <div style={{ fontSize:'2rem',marginBottom:'0.75rem' }}>📄</div>
              <div>No file attached yet.</div>
              <div style={{ fontSize:'0.75rem',color:'var(--txt3)',marginTop:'0.5rem' }}>Edit this certificate in the Admin Panel to add an image or PDF.</div>
            </div>
          )}
          {cert.file && isImage && (
            <img src={cert.file} alt={cert.name} style={{ maxWidth:'100%',maxHeight:'72vh',borderRadius:8,display:'block' }} />
          )}
          {cert.file && isPdf && (
            <iframe src={cert.file} title={cert.name} style={{ width:'100%',height:'70vh',border:'none',display:'block' }} />
          )}
        </div>
      </div>
    </div>
  )
}
