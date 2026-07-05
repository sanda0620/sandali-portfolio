'use client'
import { useState, useEffect } from 'react'
import { Project, Certificate, Settings } from '@/app/page'

const CAT_META: Record<string,{label:string}> = {
  ml:{label:'Machine Learning'}, de:{label:'Data Engineering'},
  dv:{label:'Data Visualization'}, da:{label:'Data Analysis'}, wd:{label:'Web Development'},
}
const ADMIN_PW = 'sandali2026'

type Tab = 'add'|'manage'|'reorder'|'certs'|'manage-certs'|'cv'|'skills'

// Keep auth state OUTSIDE component so it survives re-renders from onRefresh
let _authed = false

export default function AdminPanel({ projects, certs, settings, onClose, onRefresh }: {
  projects: Project[]; certs: Certificate[]; settings: Settings
  onClose: () => void; onRefresh: () => void
}) {
  const [authed, setAuthed]         = useState(_authed)
  const [pw, setPw]                 = useState('')
  const [pwErr, setPwErr]           = useState(false)
  const [tab, setTab]               = useState<Tab>('add')
  const [successMsg, setSuccessMsg] = useState('')

  function showSuccess(msg: string) {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  function checkPw() {
    if (pw === ADMIN_PW) {
      _authed = true
      setAuthed(true)
      setPw('')
    } else {
      setPwErr(true)
      setPw('')
      setTimeout(() => setPwErr(false), 2000)
    }
  }

  async function refresh() {
    await onRefresh()
  }

  function api(path: string, method = 'GET', body?: any) {
    return fetch(path, {
      method,
      headers: { 'Content-Type': 'application/json', 'x-admin-password': ADMIN_PW },
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  async function uploadFile(file: File, folder: string): Promise<string> {
    const fd = new FormData()
    fd.append('file', file)
    fd.append('folder', folder)
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'x-admin-password': ADMIN_PW },
      body: fd,
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Upload failed')
    return data.url
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', h) }
  }, [onClose])

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{ position:'fixed',inset:0,zIndex:600,background:'rgba(0,0,0,0.75)',backdropFilter:'blur(12px)',display:'flex',alignItems:'flex-start',justifyContent:'center',padding:'2rem 1rem',overflowY:'auto' }}
    >
      <div style={{ background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:20,width:'min(760px,96vw)',boxShadow:'0 28px 80px rgba(0,0,0,0.7)',overflow:'hidden' }}>
        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'1.3rem 1.8rem',borderBottom:'1px solid var(--border)',background:'var(--surface)' }}>
          <div>
            <div style={{ fontFamily:'Syne,sans-serif',fontSize:'1rem',fontWeight:700,color:'var(--txt)',display:'flex',alignItems:'center',gap:'0.6rem' }}>
              <span style={{ width:8,height:8,borderRadius:'50%',background:'var(--accent)',display:'block' }} />
              Portfolio Admin
            </div>
            <div style={{ fontSize:'0.72rem',color:'var(--txt3)',marginTop:'0.15rem' }}>Private · Only visible to you</div>
          </div>
          <button onClick={onClose} style={{ width:30,height:30,borderRadius:7,border:'1px solid var(--border)',background:'var(--surface)',color:'var(--txt2)',fontSize:'1rem',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center' }}>✕</button>
        </div>

        {!authed ? (
          <div style={{ padding:'2rem',textAlign:'center' }}>
            <div style={{ fontFamily:'Syne,sans-serif',fontSize:'1.1rem',fontWeight:700,color:'var(--txt)',marginBottom:'0.5rem' }}>Admin Access</div>
            <p style={{ fontSize:'0.82rem',color:'var(--txt2)',marginBottom:'1.4rem' }}>Enter your password to manage projects</p>
            <div style={{ display:'flex',gap:'0.6rem',justifyContent:'center' }}>
              <input type="password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==='Enter'&&checkPw()} placeholder="Password"
                style={{ padding:'0.6rem 1rem',border:'1px solid var(--border)',borderRadius:8,background:'var(--surface)',color:'var(--txt)',fontFamily:'DM Sans,sans-serif',fontSize:'0.9rem',width:260,textAlign:'center',outline:'none' }} />
              <button onClick={checkPw} className="abtn-add">Enter</button>
            </div>
            {pwErr && <div style={{ fontSize:'0.75rem',color:'#ef4444',marginTop:'0.5rem' }}>Incorrect password</div>}
          </div>
        ) : (
          <div style={{ padding:'1.8rem' }}>
            <div style={{ display:'flex',gap:'0.45rem',flexWrap:'wrap',marginBottom:'1.5rem' }}>
              {(['add','manage','reorder','certs','manage-certs','cv','skills'] as Tab[]).map((t,i) => (
                <button key={t} onClick={()=>setTab(t)} style={{
                  padding:'0.38rem 1rem',borderRadius:7,
                  border:`1px solid ${tab===t?'transparent':'var(--border)'}`,
                  background:tab===t?'var(--accent2)':'var(--surface)',
                  color:tab===t?'#eef0f4':'var(--txt2)',
                  fontSize:'0.78rem',fontWeight:500,cursor:'pointer',fontFamily:'DM Sans,sans-serif',transition:'all 0.18s',
                }}>
                  {['Add Project','Manage','Reorder','Add Cert','Manage Certs','Update CV','Skills'][i]}
                </button>
              ))}
            </div>

            {successMsg && (
              <div style={{ padding:'0.75rem 1rem',background:'rgba(74,222,128,0.1)',border:'1px solid rgba(74,222,128,0.25)',borderRadius:8,fontSize:'0.8rem',color:'#4ade80',marginBottom:'1rem' }}>
                {successMsg}
              </div>
            )}

            {tab==='add'          && <AddProjectTab api={api} uploadFile={uploadFile} onDone={async()=>{await refresh();showSuccess('Project added!')}} />}
            {tab==='manage'       && <ManageTab projects={projects} api={api} onDone={async()=>{await refresh();showSuccess('Changes saved!')}} />}
            {tab==='reorder'      && <ReorderTab projects={projects} api={api} onDone={async()=>{await refresh();showSuccess('Order saved!')}} />}
            {tab==='certs'        && <AddCertTab api={api} uploadFile={uploadFile} onDone={async()=>{await refresh();showSuccess('Certificate added!')}} />}
            {tab==='manage-certs' && <ManageCertsTab certs={certs} api={api} onDone={async()=>{await refresh();showSuccess('Saved!')}} />}
            {tab==='cv'           && <CvTab settings={settings} api={api} uploadFile={uploadFile} onDone={async()=>{await refresh();showSuccess('CV updated!')}} />}
            {tab==='skills'       && <SkillsTab settings={settings} api={api} onDone={async()=>{await refresh();showSuccess('Skills saved!')}} />}
          </div>
        )}
      </div>
    </div>
  )
}

function AddProjectTab({ api, uploadFile, onDone }: any) {
  const empty = { title:'',cat:'ml',desc:'',tags:'',year:'2026',gh:'',imgUrl:'',featured:'yes',group:'no' }
  const [f, setF]           = useState(empty)
  const [imgFile, setImgFile] = useState<File|null>(null)
  const [preview, setPreview] = useState('')
  const [busy, setBusy]       = useState(false)
  const [err, setErr]         = useState('')

  async function submit() {
    if (!f.title||!f.desc||!f.tags) { setErr('Title, description and tags are required.'); return }
    setErr(''); setBusy(true)
    try {
      let img = f.imgUrl
      if (imgFile) img = await uploadFile(imgFile,'projects')
      const res = await api('/api/projects','POST',{
        cat:f.cat,year:f.year,title:f.title,description:f.desc,
        tags:f.tags.split(',').map((s:string)=>s.trim()).filter(Boolean),
        gh:f.gh,img,featured:f.featured==='yes',groupProject:f.group==='yes',status:'completed',
      })
      if (!res.ok) { const d=await res.json(); throw new Error(d.error||'Failed') }
      setF(empty); setImgFile(null); setPreview('')
      await onDone()
    } catch(e:any) { setErr(e.message) } finally { setBusy(false) }
  }

  return (
    <div style={{ display:'flex',flexDirection:'column',gap:'1rem' }}>
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem' }}>
        <div className="afield"><label>Title *</label><input value={f.title} onChange={e=>setF({...f,title:e.target.value})} placeholder="Project title" /></div>
        <div className="afield"><label>Category *</label><select value={f.cat} onChange={e=>setF({...f,cat:e.target.value})}>
          {Object.entries(CAT_META).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}</select></div>
      </div>
      <div className="afield"><label>Description *</label><textarea value={f.desc} onChange={e=>setF({...f,desc:e.target.value})} placeholder="Describe the project..." /></div>
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem' }}>
        <div className="afield"><label>Technologies (comma-separated) *</label><input value={f.tags} onChange={e=>setF({...f,tags:e.target.value})} placeholder="Python, pandas" /></div>
        <div className="afield"><label>Year</label><input value={f.year} onChange={e=>setF({...f,year:e.target.value})} /></div>
      </div>
      <div className="afield"><label>GitHub URL</label><input type="url" value={f.gh} onChange={e=>setF({...f,gh:e.target.value})} placeholder="https://github.com/..." /></div>
      <div className="afield">
        <label>Cover Image URL (Cloudinary / GitHub raw)</label>
        <input type="url" value={f.imgUrl} onChange={e=>{ setF({...f,imgUrl:e.target.value}); setPreview(e.target.value); setImgFile(null) }} placeholder="https://res.cloudinary.com/..." />
        <div style={{ textAlign:'center',fontSize:'0.68rem',color:'var(--txt3)',margin:'0.3rem 0' }}>— or upload from device —</div>
        <div className="file-upload-area">
          <input type="file" accept="image/*" onChange={e=>{ const file=e.target.files?.[0]; if(!file) return; setImgFile(file); setPreview(URL.createObjectURL(file)); setF({...f,imgUrl:''}) }} />
          <div className="file-upload-label">Drop image or <span>browse</span></div>
        </div>
        {preview && <img src={preview} alt="preview" style={{ width:'100%',height:100,objectFit:'cover',borderRadius:8,marginTop:'0.4rem',border:'1px solid var(--border)' }} />}
      </div>
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem' }}>
        <div className="afield"><label>Featured in All?</label><select value={f.featured} onChange={e=>setF({...f,featured:e.target.value})}>
          <option value="yes">Yes — show in All</option><option value="no">No — category only</option></select></div>
        <div className="afield"><label>Group Project?</label><select value={f.group} onChange={e=>setF({...f,group:e.target.value})}>
          <option value="no">No</option><option value="yes">Yes</option></select></div>
      </div>
      {err && <div style={{ fontSize:'0.78rem',color:'#ef4444',padding:'0.5rem',background:'rgba(239,68,68,0.08)',borderRadius:6 }}>{err}</div>}
      <div style={{ display:'flex',justifyContent:'flex-end' }}>
        <button className="abtn-add" onClick={submit} disabled={busy}>{busy?'Saving…':'Add Project'}</button>
      </div>
    </div>
  )
}

function ManageTab({ projects, api, onDone }: any) {
  const [editing, setEditing] = useState<string|null>(null)
  const [fields, setFields]   = useState<any>({})
  const [busy, setBusy]       = useState(false)
  const [err, setErr]         = useState('')

  function startEdit(p: Project) {
    setEditing(p._id)
    setFields({ title:p.title,cat:p.cat,desc:p.description,tags:p.tags.join(', '),year:p.year,gh:p.gh||'',img:p.img||'',featured:String(p.featured),groupProject:String(p.groupProject) })
  }

  async function save(id: string) {
    setBusy(true); setErr('')
    try {
      const res = await api(`/api/projects/${id}`,'PUT',{
        title:fields.title,cat:fields.cat,description:fields.desc,
        tags:fields.tags.split(',').map((s:string)=>s.trim()).filter(Boolean),
        year:fields.year,gh:fields.gh,img:fields.img,
        featured:fields.featured==='true',groupProject:fields.groupProject==='true',
      })
      if (!res.ok) { const d=await res.json(); throw new Error(d.error||'Failed to save') }
      setEditing(null)
      await onDone()
    } catch(e:any) { setErr(e.message) } finally { setBusy(false) }
  }

  async function del(id: string) {
    if (!confirm('Delete this project?')) return
    await api(`/api/projects/${id}`,'DELETE')
    await onDone()
  }

  return (
    <div style={{ display:'flex',flexDirection:'column',gap:'0.75rem',maxHeight:'60vh',overflowY:'auto' }}>
      {projects.map((p: Project) => (
        <div key={p._id}>
          <div style={{ display:'flex',alignItems:'center',gap:'1rem',padding:'0.9rem 1rem',background:'var(--surface)',border:'1px solid var(--border)',borderRadius:editing===p._id?'10px 10px 0 0':10 }}>
            <div style={{ width:56,height:40,borderRadius:6,overflow:'hidden',flexShrink:0,background:'var(--bg3)' }}>
              {p.img && <img src={p.img} alt="" style={{ width:'100%',height:'100%',objectFit:'cover' }} />}
            </div>
            <div style={{ flex:1,minWidth:0 }}>
              <div style={{ fontSize:'0.82rem',fontWeight:600,color:'var(--txt)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' }}>{p.title}</div>
              <div style={{ fontSize:'0.68rem',color:'var(--txt3)',marginTop:'0.12rem' }}>{CAT_META[p.cat]?.label} · {p.year}{p.featured?' · Featured':''}</div>
            </div>
            <div style={{ display:'flex',gap:'0.4rem',flexShrink:0 }}>
              <button onClick={()=>editing===p._id?setEditing(null):startEdit(p)}
                style={{ padding:'0.25rem 0.65rem',borderRadius:6,border:'1px solid rgba(139,163,199,0.3)',background:'rgba(139,163,199,0.08)',color:'var(--accent2)',fontSize:'0.72rem',cursor:'pointer' }}>
                {editing===p._id?'Cancel':'Edit'}
              </button>
              <button onClick={()=>del(p._id)} style={{ width:28,height:28,borderRadius:6,border:'1px solid var(--border)',background:'var(--surface)',color:'var(--txt3)',fontSize:'0.9rem',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center' }}>✕</button>
            </div>
          </div>
          {editing===p._id && (
            <div style={{ padding:'1rem',background:'var(--surface)',border:'1px solid var(--border)',borderTop:'none',borderRadius:'0 0 10px 10px' }}>
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem',marginBottom:'0.75rem' }}>
                <div className="afield"><label>Title</label><input value={fields.title} onChange={e=>setFields({...fields,title:e.target.value})} /></div>
                <div className="afield"><label>Category</label><select value={fields.cat} onChange={e=>setFields({...fields,cat:e.target.value})}>
                  {Object.entries(CAT_META).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}</select></div>
              </div>
              <div className="afield" style={{ marginBottom:'0.75rem' }}><label>Description</label><textarea value={fields.desc} onChange={e=>setFields({...fields,desc:e.target.value})} /></div>
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem',marginBottom:'0.75rem' }}>
                <div className="afield"><label>Tags (comma-separated)</label><input value={fields.tags} onChange={e=>setFields({...fields,tags:e.target.value})} /></div>
                <div className="afield"><label>Year</label><input value={fields.year} onChange={e=>setFields({...fields,year:e.target.value})} /></div>
              </div>
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem',marginBottom:'0.75rem' }}>
                <div className="afield"><label>GitHub URL</label><input type="url" value={fields.gh} onChange={e=>setFields({...fields,gh:e.target.value})} /></div>
                <div className="afield"><label>Image URL</label><input type="url" value={fields.img} onChange={e=>setFields({...fields,img:e.target.value})} /></div>
              </div>
              {fields.img && <img src={fields.img} alt="preview" style={{ width:'100%',height:80,objectFit:'cover',borderRadius:6,marginBottom:'0.75rem',border:'1px solid var(--border)' }} />}
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem',marginBottom:'0.75rem' }}>
                <div className="afield"><label>Featured?</label><select value={fields.featured} onChange={e=>setFields({...fields,featured:e.target.value})}>
                  <option value="true">Yes</option><option value="false">No</option></select></div>
                <div className="afield"><label>Group Project?</label><select value={fields.groupProject} onChange={e=>setFields({...fields,groupProject:e.target.value})}>
                  <option value="false">No</option><option value="true">Yes</option></select></div>
              </div>
              {err && <div style={{ fontSize:'0.75rem',color:'#ef4444',marginBottom:'0.5rem' }}>{err}</div>}
              <div style={{ display:'flex',justifyContent:'flex-end',gap:'0.6rem' }}>
                <button className="abtn-cancel" onClick={()=>setEditing(null)}>Cancel</button>
                <button className="abtn-add" onClick={()=>save(p._id)} disabled={busy}>{busy?'Saving…':'Save Changes'}</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function ReorderTab({ projects, api, onDone }: any) {
  const [order, setOrder]   = useState<Project[]>([...projects].sort((a,b)=>a.displayOrder-b.displayOrder))
  const [dragIdx, setDragIdx] = useState<number|null>(null)
  const [busy, setBusy]     = useState(false)

  function move(idx: number, dir: number) {
    const o=[...order]; const ni=idx+dir
    if(ni<0||ni>=o.length) return
    ;[o[idx],o[ni]]=[o[ni],o[idx]]; setOrder(o)
  }

  async function apply() {
    setBusy(true)
    await Promise.all(order.map((p,i)=>api(`/api/projects/${p._id}`,'PUT',{displayOrder:i})))
    await onDone(); setBusy(false)
  }

  return (
    <div>
      <p style={{ fontSize:'0.78rem',color:'var(--txt2)',marginBottom:'1.2rem' }}>Drag rows or use arrows. Click Apply to save.</p>
      <div style={{ display:'flex',flexDirection:'column',gap:'0.5rem',maxHeight:'55vh',overflowY:'auto' }}>
        {order.map((p,i)=>(
          <div key={p._id} draggable
            onDragStart={()=>setDragIdx(i)} onDragOver={e=>e.preventDefault()}
            onDrop={()=>{ if(dragIdx===null||dragIdx===i) return; const o=[...order]; const [item]=o.splice(dragIdx,1); o.splice(i,0,item); setOrder(o); setDragIdx(null) }}
            style={{ display:'flex',alignItems:'center',gap:'0.75rem',padding:'0.75rem 1rem',background:'var(--surface)',border:'1px solid var(--border)',borderRadius:10,cursor:'grab' }}>
            <div style={{ display:'flex',flexDirection:'column',gap:3,opacity:0.4 }}>
              {[0,1,2].map(j=><span key={j} style={{ display:'block',width:16,height:2,background:'var(--txt2)',borderRadius:999 }} />)}
            </div>
            <div style={{ width:20,textAlign:'center',fontFamily:'Syne,sans-serif',fontSize:'0.72rem',fontWeight:700,color:'var(--txt3)' }}>{i+1}</div>
            <div style={{ width:44,height:32,borderRadius:6,overflow:'hidden',background:'var(--bg3)',flexShrink:0 }}>
              {p.img && <img src={p.img} alt="" style={{ width:'100%',height:'100%',objectFit:'cover' }} />}
            </div>
            <div style={{ flex:1,minWidth:0 }}>
              <div style={{ fontSize:'0.82rem',fontWeight:500,color:'var(--txt)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' }}>{p.title}</div>
              <div style={{ fontSize:'0.65rem',color:'var(--txt3)' }}>{CAT_META[p.cat]?.label}</div>
            </div>
            <div style={{ display:'flex',flexDirection:'column',gap:'0.2rem' }}>
              <button onClick={()=>move(i,-1)} style={{ width:24,height:22,borderRadius:5,border:'1px solid var(--border)',background:'var(--surface)',color:'var(--txt3)',fontSize:'0.7rem',cursor:'pointer' }}>▲</button>
              <button onClick={()=>move(i,1)}  style={{ width:24,height:22,borderRadius:5,border:'1px solid var(--border)',background:'var(--surface)',color:'var(--txt3)',fontSize:'0.7rem',cursor:'pointer' }}>▼</button>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display:'flex',justifyContent:'flex-end',marginTop:'1rem' }}>
        <button className="abtn-add" onClick={apply} disabled={busy}>{busy?'Saving…':'Apply Order'}</button>
      </div>
    </div>
  )
}

function AddCertTab({ api, uploadFile, onDone }: any) {
  const [name,setName]=[useState(''),((v:string)=>{})]
  const [s,setS] = useState({name:'',issuer:'',url:'',busy:false})
  const [file,setFile] = useState<File|null>(null)
  const [preview,setPreview] = useState('')

  async function submit() {
    if(!s.name){alert('Name required');return}
    setS({...s,busy:true})
    try {
      let fileUrl=s.url,fileType=''
      if(file){fileUrl=await uploadFile(file,'certificates');fileType=file.type}
      else if(s.url){fileType=s.url.toLowerCase().endsWith('.pdf')?'application/pdf':'image/url'}
      const res=await api('/api/certificates','POST',{name:s.name,issuer:s.issuer,file:fileUrl,fileType})
      if(!res.ok){const d=await res.json();throw new Error(d.error)}
      setS({name:'',issuer:'',url:'',busy:false});setFile(null);setPreview('')
      await onDone()
    } catch(e:any){alert(e.message);setS(p=>({...p,busy:false}))}
  }

  return (
    <div style={{ display:'flex',flexDirection:'column',gap:'1rem' }}>
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem' }}>
        <div className="afield"><label>Certificate Name *</label><input value={s.name} onChange={e=>setS({...s,name:e.target.value})} placeholder="e.g. MongoDB Data Modeling" /></div>
        <div className="afield"><label>Issuer & Year</label><input value={s.issuer} onChange={e=>setS({...s,issuer:e.target.value})} placeholder="MongoDB University · 2026" /></div>
      </div>
      <div className="afield">
        <label>File URL (Cloudinary / GitHub raw)</label>
        <input type="url" value={s.url} onChange={e=>{ setS({...s,url:e.target.value}); setPreview(e.target.value); setFile(null) }} placeholder="https://..." />
      </div>
      <div className="afield">
        <label>Or upload from device</label>
        <div className="file-upload-area">
          <input type="file" accept="image/*,application/pdf" onChange={e=>{ const f=e.target.files?.[0];if(!f)return;setFile(f);setS({...s,url:''});if(f.type.startsWith('image/'))setPreview(URL.createObjectURL(f)) }} />
          <div className="file-upload-label">Drop file or <span>browse</span></div>
        </div>
        {preview && <img src={preview} alt="preview" style={{ width:'100%',height:80,objectFit:'cover',borderRadius:8,marginTop:'0.4rem',border:'1px solid var(--border)' }} />}
      </div>
      <div style={{ display:'flex',justifyContent:'flex-end' }}>
        <button className="abtn-add" onClick={submit} disabled={s.busy}>{s.busy?'Saving…':'Add Certificate'}</button>
      </div>
    </div>
  )
}

function ManageCertsTab({ certs, api, onDone }: any) {
  const [editing,setEditing] = useState<string|null>(null)
  const [fields,setFields]   = useState<any>({})
  const [busy,setBusy]       = useState(false)

  async function del(id:string) {
    if(!confirm('Remove this certificate?'))return
    await api(`/api/certificates/${id}`,'DELETE'); await onDone()
  }
  async function save(id:string) {
    setBusy(true)
    const res=await api(`/api/certificates/${id}`,'PUT',fields)
    if(!res.ok){alert('Failed to save');setBusy(false);return}
    setEditing(null); await onDone(); setBusy(false)
  }

  return (
    <div style={{ display:'flex',flexDirection:'column',gap:'0.75rem',maxHeight:'60vh',overflowY:'auto' }}>
      {certs.map((c:Certificate)=>(
        <div key={c._id}>
          <div style={{ display:'flex',alignItems:'center',gap:'1rem',padding:'0.9rem 1rem',background:'var(--surface)',border:'1px solid var(--border)',borderRadius:editing===c._id?'10px 10px 0 0':10 }}>
            <div style={{ width:44,height:32,borderRadius:6,overflow:'hidden',flexShrink:0,background:'var(--bg3)',display:'flex',alignItems:'center',justifyContent:'center' }}>
              {c.file&&c.fileType?.startsWith('image')?<img src={c.file} alt="" style={{ width:'100%',height:'100%',objectFit:'cover' }} />:<span>📄</span>}
            </div>
            <div style={{ flex:1,minWidth:0 }}>
              <div style={{ fontSize:'0.82rem',fontWeight:600,color:'var(--txt)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' }}>{c.name}</div>
              <div style={{ fontSize:'0.68rem',color:'var(--txt3)' }}>{c.issuer||'No issuer'}{c.file?' · File attached':' · No file'}</div>
            </div>
            <div style={{ display:'flex',gap:'0.4rem' }}>
              <button onClick={()=>{ if(editing===c._id){setEditing(null)}else{setEditing(c._id);setFields({name:c.name,issuer:c.issuer||'',file:c.file||'',fileType:c.fileType||''})} }}
                style={{ padding:'0.25rem 0.65rem',borderRadius:6,border:'1px solid rgba(139,163,199,0.3)',background:'rgba(139,163,199,0.08)',color:'var(--accent2)',fontSize:'0.72rem',cursor:'pointer' }}>
                {editing===c._id?'Cancel':'Edit'}
              </button>
              <button onClick={()=>del(c._id)} style={{ width:28,height:28,borderRadius:6,border:'1px solid var(--border)',background:'var(--surface)',color:'var(--txt3)',fontSize:'0.9rem',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center' }}>✕</button>
            </div>
          </div>
          {editing===c._id&&(
            <div style={{ padding:'1rem',background:'var(--surface)',border:'1px solid var(--border)',borderTop:'none',borderRadius:'0 0 10px 10px' }}>
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem',marginBottom:'0.75rem' }}>
                <div className="afield"><label>Name</label><input value={fields.name} onChange={e=>setFields({...fields,name:e.target.value})} /></div>
                <div className="afield"><label>Issuer</label><input value={fields.issuer} onChange={e=>setFields({...fields,issuer:e.target.value})} /></div>
              </div>
              <div className="afield" style={{ marginBottom:'0.75rem' }}>
                <label>File URL</label>
                <input type="url" value={fields.file} onChange={e=>setFields({...fields,file:e.target.value,fileType:e.target.value.toLowerCase().endsWith('.pdf')?'application/pdf':'image/url'})} placeholder="https://..." />
              </div>
              {fields.file&&fields.fileType?.startsWith('image')&&<img src={fields.file} alt="" style={{ width:'100%',height:70,objectFit:'cover',borderRadius:6,marginBottom:'0.75rem' }} />}
              <div style={{ display:'flex',justifyContent:'flex-end',gap:'0.6rem' }}>
                <button className="abtn-cancel" onClick={()=>setEditing(null)}>Cancel</button>
                <button className="abtn-add" onClick={()=>save(c._id)} disabled={busy}>{busy?'Saving…':'Save'}</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function CvTab({ settings, api, uploadFile, onDone }: any) {
  const [url,setUrl]   = useState(settings.cv_url||'')
  const [file,setFile] = useState<File|null>(null)
  const [busy,setBusy] = useState(false)

  async function save() {
    setBusy(true)
    try {
      let cvUrl=url
      if(file) cvUrl=await uploadFile(file,'cv')
      const res=await api('/api/settings','POST',{key:'cv_url',value:cvUrl})
      if(!res.ok) throw new Error('Failed')
      await onDone()
    } catch(e:any){alert(e.message)} finally{setBusy(false)}
  }

  return (
    <div style={{ display:'flex',flexDirection:'column',gap:'1rem' }}>
      <div style={{ padding:'0.85rem 1rem',background:'var(--surface)',border:'1px solid var(--border)',borderRadius:8,fontSize:'0.82rem',color:'var(--txt2)',display:'flex',alignItems:'center',justifyContent:'space-between' }}>
        <span>{settings.cv_url?'✓ CV saved — visible to all visitors':'No CV uploaded yet'}</span>
        {settings.cv_url&&<a href={settings.cv_url} target="_blank" rel="noopener noreferrer" style={{ padding:'0.3rem 0.75rem',borderRadius:6,border:'1px solid rgba(139,163,199,0.3)',background:'rgba(139,163,199,0.08)',color:'var(--accent2)',fontSize:'0.72rem',textDecoration:'none' }}>Preview</a>}
      </div>
      <div className="afield">
        <label>CV URL (Cloudinary or GitHub raw)</label>
        <input type="url" value={url} onChange={e=>{setUrl(e.target.value);setFile(null)}} placeholder="https://raw.githubusercontent.com/sanda0620/..." />
        <div className="hint">A public URL is visible to all visitors worldwide.</div>
      </div>
      <div className="afield">
        <label>Or upload PDF (auto-uploads to Cloudinary)</label>
        <div className="file-upload-area">
          <input type="file" accept="application/pdf" onChange={e=>{const f=e.target.files?.[0];if(f){setFile(f);setUrl('')}}} />
          <div className="file-upload-label">{file?`✓ ${file.name}`:'Drop PDF or <span style="color:var(--accent)">browse</span>'}</div>
        </div>
      </div>
      {url&&<div style={{ height:250,borderRadius:8,overflow:'hidden',border:'1px solid var(--border)' }}><iframe src={url} title="CV" style={{ width:'100%',height:'100%',border:'none' }} /></div>}
      <div style={{ display:'flex',justifyContent:'flex-end' }}>
        <button className="abtn-add" onClick={save} disabled={busy}>{busy?'Saving…':'Save CV'}</button>
      </div>
    </div>
  )
}

const LEVELS=['expert','advanced','intermediate','beginner']
const LEVEL_LABELS:Record<string,string>={expert:'Expert',advanced:'Advanced',intermediate:'Intermediate',beginner:'Beginner'}

function SkillsTab({ settings, api, onDone }: any) {
  const def={lang:[{name:'Python (pandas, numpy, scikit-learn)',level:'expert'},{name:'R (dplyr, ggplot2, statistics)',level:'advanced'},{name:'SQL / PostgreSQL / SQL Server',level:'expert'},{name:'Java / Spring Boot / REST APIs',level:'intermediate'},{name:'React.js / JavaScript / Node.js',level:'intermediate'}],data:[{name:'ETL / SSIS / SSAS / Star Schema',level:'advanced'},{name:'Apache Kafka (streaming)',level:'advanced'},{name:'Power BI / Grafana',level:'advanced'},{name:'Docker / GitHub Actions CI/CD',level:'intermediate'},{name:'Machine Learning (RF, Regression)',level:'advanced'}]}
  const [skills,setSkills]=useState<any>(settings.skills||def)
  function update(g:string,i:number,level:string){setSkills({...skills,[g]:skills[g].map((s:any,j:number)=>j===i?{...s,level}:s)})}
  async function save(){await api('/api/settings','POST',{key:'skills',value:skills});await onDone()}
  return (
    <div style={{ display:'flex',flexDirection:'column',gap:'1.5rem' }}>
      {(['lang','data'] as const).map(g=>(
        <div key={g}>
          <div style={{ fontSize:'0.68rem',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.12em',color:'var(--txt3)',marginBottom:'0.8rem' }}>{g==='lang'?'Languages & Frameworks':'Data & Infrastructure'}</div>
          {skills[g].map((s:any,i:number)=>(
            <div key={s.name} style={{ display:'flex',alignItems:'center',gap:'0.5rem',marginBottom:'0.55rem' }}>
              <span style={{ flex:1,fontSize:'0.78rem',color:'var(--txt2)' }}>{s.name}</span>
              <select value={s.level} onChange={e=>update(g,i,e.target.value)} style={{ padding:'0.25rem 0.5rem',background:'var(--surface)',border:'1px solid var(--border)',borderRadius:6,color:'var(--txt)',fontSize:'0.72rem',fontFamily:'DM Sans,sans-serif',outline:'none' }}>
                {LEVELS.map(l=><option key={l} value={l}>{LEVEL_LABELS[l]}</option>)}
              </select>
            </div>
          ))}
        </div>
      ))}
      <div style={{ display:'flex',justifyContent:'flex-end' }}>
        <button className="abtn-add" onClick={save}>Save Skills</button>
      </div>
    </div>
  )
}