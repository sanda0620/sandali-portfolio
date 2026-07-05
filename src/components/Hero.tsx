'use client'
import { useEffect, useRef } from 'react'

export default function Hero({ cvOpen }: { cvOpen: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cv = canvasRef.current
    if (!cv) return
    const ctx = cv.getContext('2d')!
    let animId: number
    const pts: any[] = []
    let mx: number | null = null, my: number | null = null

    const resize = () => { cv.width = window.innerWidth; cv.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY })

    for (let i = 0; i < 80; i++) pts.push({
      x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22,
      r: Math.random() * 0.9 + 0.25, a: Math.random() * 0.3 + 0.08,
    })

    const tick = () => {
      ctx.clearRect(0, 0, cv.width, cv.height)
      const lt = document.documentElement.getAttribute('data-theme') === 'light'
      const pc = lt ? 'rgba(58,95,138,' : 'rgba(168,189,212,'
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy
        if (mx) { const dx = mx - p.x, dy = my! - p.y, d = Math.hypot(dx, dy); if (d < 100) { p.x -= dx * 0.003; p.y -= dy * 0.003 } }
        if (p.x < 0 || p.x > cv.width) p.vx *= -1
        if (p.y < 0 || p.y > cv.height) p.vy *= -1
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = pc + p.a + ')'; ctx.fill()
      }
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, d = Math.hypot(dx, dy)
        if (d < 70) {
          ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y)
          ctx.strokeStyle = pc + (0.04 * (1 - d / 70)) + ')'; ctx.lineWidth = 0.5; ctx.stroke()
        }
      }
      animId = requestAnimationFrame(tick)
    }
    tick()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <section id="hero" style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      position: 'relative', overflow: 'hidden', padding: '6rem 2.5rem 4rem',
    }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, zIndex: 0 }} />
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 75% 50% at 50% -2%, rgba(139,163,199,0.15) 0%, transparent 68%)',
      }} />

      <div className="hero-grid" style={{
        position: 'relative', zIndex: 2,
        maxWidth: 1120, width: '100%', margin: '0 auto',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center',
      }}>
        {/* Text */}
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase',
            fontWeight: 500, color: 'var(--accent)', marginBottom: '1rem',
          }}>
            <span style={{ width: 18, height: 1, background: 'var(--accent)', display: 'block' }} />
            Data Science Undergraduate · SLIIT
          </div>
          <h1 style={{ color: 'var(--txt)', marginBottom: '0.25rem' }}>
            Sandali<br /><span style={{ color: 'var(--accent3)' }}>Ruwanya</span>
          </h1>
          <p style={{ fontSize: '0.95rem', fontWeight: 300, color: 'var(--txt2)', margin: '0.5rem 0 1.2rem', letterSpacing: '0.02em' }}>
            Data Science Undergraduate &nbsp;·&nbsp; Colombo, Sri Lanka
          </p>
          <p style={{ fontSize: '0.88rem', lineHeight: 1.82, color: 'var(--txt2)', maxWidth: 420, marginBottom: '1.8rem' }}>
            I build across the full data stack — real-time streaming pipelines, machine learning models,
            enterprise BI dashboards, and production-grade REST APIs. I don't just analyse data; I engineer systems that keep it moving and meaningful.
          </p>
          <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
            <a href="#projects" className="btn-p">View Projects</a>
            <button onClick={cvOpen} className="btn-o">View CV</button>
          </div>
        </div>

        {/* Photo */}
        <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 5,
            position: 'absolute', top: 28, left: -28, opacity: 0.22,
          }}>
            {Array.from({ length: 25 }).map((_, i) => (
              <div key={i} style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--accent)' }} />
            ))}
          </div>
          <div style={{
            width: 300, height: 360,
            borderRadius: '150px 150px 110px 110px',
            padding: 3,
            background: 'linear-gradient(145deg, var(--accent3), var(--accent2), var(--border))',
            position: 'relative',
          }}>
            <div style={{
              width: '100%', height: '100%',
              borderRadius: '148px 148px 108px 108px',
              overflow: 'hidden', background: 'var(--bg2)',
            }}>
              <img
                src="/photo.jpg"
                alt="Sandali Ruwanya"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
                onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            </div>
            <div style={{
              position: 'absolute', bottom: -14, left: '50%', transform: 'translateX(-50%)',
              background: 'var(--glass)', border: '1px solid var(--border)',
              backdropFilter: 'blur(16px)', borderRadius: 999,
              padding: '0.4rem 1.1rem', fontSize: '0.68rem', fontWeight: 500,
              color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap',
            }}>
              BSc. Data Science &nbsp;·&nbsp; SLIIT
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
