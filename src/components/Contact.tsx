'use client'
import { useState } from 'react'

export default function Contact() {
  const [form, setForm] = useState({ name:'', email:'', subject:'', message:'' })
  const [status, setStatus] = useState<'idle'|'sending'|'ok'|'err'>('idle')

  async function submit() {
    if (!form.name || !form.email || !form.message) { alert('Please fill in Name, Email and Message.'); return }
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form)
      })
      setStatus(res.ok ? 'ok' : 'err')
      if (res.ok) setForm({ name:'', email:'', subject:'', message:'' })
    } catch { setStatus('err') }
    setTimeout(() => setStatus('idle'), 6000)
  }

  const links = [
    { icon:'@',  title:'Email',    sub:'ruwanyasandali@gmail.com', href:'mailto:ruwanyasandali@gmail.com' },
    { icon:'GH', title:'GitHub',   sub:'github.com/sanda0620',     href:'https://github.com/sanda0620' },
    { icon:'in', title:'LinkedIn', sub:'sandali-ruwanya',          href:'https://www.linkedin.com/in/sandali-ruwanya-58b4942a5/' },
    { icon:'LK', title:'Location', sub:'Colombo, Sri Lanka',       href:null },
  ]

  return (
    <div id="contact">
      <div className="section-wrap">
        <div className="sec-hd">
          <div className="sec-eye">Get in Touch</div>
          <h2>Let's Connect</h2>
        </div>
        <div className="contact-grid" style={{ display:'grid', gap:'2rem', alignItems:'start' }}>
          {/* Links */}
          <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
            <p style={{ fontSize:'0.88rem',lineHeight:1.8,color:'var(--txt2)',marginBottom:'0.5rem' }}>Open to internship opportunities, collaborations, and research projects. Drop a message and I'll get back within 24 hours.</p>
            {links.map(l => {
              const inner = (
                <>
                  <div style={{ width:36,height:36,borderRadius:8,flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(139,163,199,0.12)',border:'1px solid var(--border)',fontSize:'0.8rem',fontWeight:700,color:'var(--accent3)',fontFamily:'Syne,sans-serif' }}>{l.icon}</div>
                  <div><div style={{ fontSize:'0.83rem',fontWeight:500,color:'var(--txt)' }}>{l.title}</div><div style={{ fontSize:'0.7rem',color:'var(--txt2)',marginTop:'0.1rem' }}>{l.sub}</div></div>
                </>
              )
              return l.href ? (
                <a key={l.title} href={l.href} target="_blank" rel="noopener noreferrer" className="gc"
                  style={{ padding:'1rem 1.2rem',display:'flex',alignItems:'center',gap:'0.85rem',textDecoration:'none' }}>{inner}</a>
              ) : (
                <div key={l.title} className="gc" style={{ padding:'1rem 1.2rem',display:'flex',alignItems:'center',gap:'0.85rem',cursor:'default' }}>{inner}</div>
              )
            })}
          </div>
          {/* Form */}
          <div className="gc" style={{ padding:'1.6rem' }}>
            <div className="syne" style={{ fontSize:'0.95rem',fontWeight:600,color:'var(--txt)',marginBottom:'1.2rem' }}>Send a Message</div>
              <div className="contact-form-row" style={{ display:'grid',gap:'0.75rem',marginBottom:'0.75rem' }}>
              <div className="afield"><label>Name</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your name" /></div>
              <div className="afield"><label>Email</label><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="your@email.com" /></div>
            </div>
            <div className="afield" style={{ marginBottom:'0.75rem' }}><label>Subject</label><input value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} placeholder="Internship opportunity / Collaboration" /></div>
            <div className="afield"><label>Message</label><textarea value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="Tell me about the opportunity..." /></div>
            <button onClick={submit} disabled={status==='sending'} className="abtn-add" style={{ width:'100%',marginTop:'0.75rem',opacity:status==='sending'?0.6:1 }}>
              {status==='sending' ? 'Sending…' : 'Send Message'}
            </button>
            {status==='ok'  && <div className="admin-success show" style={{ marginTop:'0.6rem' }}>Message sent! I'll get back to you within 24 hours.</div>}
            {status==='err' && <div style={{ padding:'0.7rem 1rem',background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:8,fontSize:'0.78rem',color:'#f87171',marginTop:'0.6rem' }}>Something went wrong. Please email me directly.</div>}
            <p style={{ fontSize:'0.65rem',color:'var(--txt3)',marginTop:'0.75rem',textAlign:'center' }}>Powered by Resend</p>
          </div>
        </div>
      </div>
    </div>
  )
}
