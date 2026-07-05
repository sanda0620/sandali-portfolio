'use client'
import { useEffect, useRef } from 'react'
import { Project } from '@/app/page'

declare const Chart: any

const CAT_ORDER = ['de','dv','ml','da','wd']
const CAT_LABELS = ['Data Engineering','Data Visualization','Machine Learning','Data Analysis','Web Dev']

export default function Insights({ projects, dark }: { projects: Project[]; dark: boolean }) {
  const rcRef = useRef<HTMLCanvasElement>(null)
  const dcRef = useRef<HTMLCanvasElement>(null)
  const bcRef = useRef<HTMLCanvasElement>(null)
  const lcRef = useRef<HTMLCanvasElement>(null)
  const chartsRef = useRef<any[]>([])

  const ac  = () => dark ? '#8ba3c7' : '#3a5f8a'
  const ac2 = () => dark ? '#6b8aad' : '#2d4f78'
  const ac3 = () => dark ? '#a8bdd4' : '#5a7fa8'
  const t2  = () => dark ? 'rgba(236,238,242,0.45)' : 'rgba(26,29,36,0.5)'
  const gr  = () => dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js'
    script.onload = () => buildCharts()
    document.head.appendChild(script)
    return () => { chartsRef.current.forEach(c => c?.destroy()) }
  }, [])

  useEffect(() => {
    if ((window as any).Chart) buildCharts()
  }, [dark, projects])

  function buildCharts() {
    chartsRef.current.forEach(c => c?.destroy())
    chartsRef.current = []
    if (!rcRef.current || !dcRef.current || !bcRef.current || !lcRef.current) return

    const catCounts = CAT_ORDER.map(c => projects.filter(p => p.cat === c).length)
    const techCount: Record<string,number> = {}
    projects.forEach(p => p.tags.forEach(t => { techCount[t] = (techCount[t]||0)+1 }))
    const topTechs = Object.entries(techCount).sort((a,b)=>b[1]-a[1]).slice(0,8)
    const scaleProjs = projects.filter(p => p.dataScale).slice(0,6)

    chartsRef.current.push(new Chart(rcRef.current, {
      type:'radar',
      data:{ labels:['ML','Data Eng.','Visualization','Statistics','Full Stack','BI Tools'],
        datasets:[{ data:[81,85,88,83,73,82], backgroundColor:ac()+'22', borderColor:ac3(), borderWidth:1.5, pointBackgroundColor:ac2(), pointBorderColor:ac3(), pointRadius:3.5 }] },
      options:{ responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false}},
        scales:{r:{ min:0,max:100,ticks:{display:false},grid:{color:gr()},angleLines:{color:gr()},pointLabels:{color:t2(),font:{family:'DM Sans',size:10}} }} }
    }))

    chartsRef.current.push(new Chart(dcRef.current, {
      type:'doughnut',
      data:{ labels:CAT_LABELS, datasets:[{ data:catCounts, backgroundColor:[ac()+'cc',ac3()+'cc',ac2()+'cc',ac()+'88',ac3()+'66'], borderColor:dark?'#42454b':'#e8ebf0', borderWidth:3, hoverOffset:6 }] },
      options:{ responsive:true, maintainAspectRatio:false, plugins:{legend:{position:'bottom',labels:{color:t2(),font:{size:10,family:'DM Sans'},boxWidth:9,padding:7}}} }
    }))

    if (topTechs.length) {
      chartsRef.current.push(new Chart(bcRef.current, {
        type:'bar',
        data:{ labels:topTechs.map(e=>e[0]), datasets:[{ data:topTechs.map(e=>e[1]), backgroundColor:topTechs.map((_,i)=>[ac()+'cc',ac3()+'cc',ac2()+'cc',ac()+'aa',ac3()+'aa',ac2()+'99',ac()+'88',ac3()+'88'][i%8]), borderRadius:4, borderSkipped:false }] },
        options:{ responsive:true, maintainAspectRatio:false, animation:{duration:600}, plugins:{legend:{display:false}},
          scales:{ x:{ticks:{color:t2(),font:{size:10}},grid:{display:false},border:{display:false}}, y:{ticks:{color:t2(),font:{size:10},stepSize:1},grid:{color:gr()},border:{display:false}} } }
      }))
    }

    if (scaleProjs.length) {
      chartsRef.current.push(new Chart(lcRef.current, {
        type:'bar',
        data:{ labels:scaleProjs.map(p=>p.title.split(' ').slice(0,2).join(' ')), datasets:[{ data:scaleProjs.map(p=>p.dataScale), backgroundColor:[ac()+'bb',ac3()+'bb',ac2()+'bb',ac()+'99',ac3()+'88',ac2()+'88'], borderRadius:4, borderSkipped:false }] },
        options:{ indexAxis:'y', responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false}},
          scales:{ x:{ticks:{color:t2(),font:{size:9},callback:(v:number)=>v>=1000?(v/1000).toFixed(0)+'K':v},grid:{color:gr()},border:{display:false}}, y:{ticks:{color:t2(),font:{size:9}},grid:{display:false},border:{display:false}} } }
      }))
    }
  }

  const tagCount: Record<string,number> = {}
  projects.forEach(p => p.tags.forEach(t => { tagCount[t]=(tagCount[t]||0)+1 }))
  const sortedTags = Object.entries(tagCount).sort((a,b)=>b[1]-a[1])
  const maxT = sortedTags[0]?.[1] || 1

  return (
    <div className="section-alt" id="insights">
      <div className="section-wrap">
        <div className="sec-hd">
          <div className="sec-eye">Analytics</div>
          <h2>Project Insights</h2>
        </div>
        <div className="ch-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.2rem' }}>
          {[
            { title:'Skill Radar', ref:rcRef },
            { title:'Project Category Mix', ref:dcRef },
            { title:'Tech Stack Frequency', ref:bcRef },
            { title:'Data Scale Per Project', ref:lcRef },
          ].map(({ title, ref }) => (
            <div key={title} className="gc" style={{ padding:'1.4rem' }}>
              <div style={{ fontSize:'0.65rem',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.14em',color:'var(--txt3)',marginBottom:'1rem' }}>{title}</div>
              <div style={{ position:'relative', height:195 }}><canvas ref={ref} /></div>
            </div>
          ))}
        </div>

        {/* Tag Cloud */}
        <div className="gc" style={{ padding:'1.4rem', marginTop:'1.2rem' }}>
          <div style={{ fontSize:'0.65rem',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.14em',color:'var(--txt3)',marginBottom:'1rem' }}>Technology Tag Cloud</div>
          <div style={{ display:'flex',flexWrap:'wrap',gap:'0.5rem',alignItems:'center',justifyContent:'center',padding:'1rem 0.5rem' }}>
            {sortedTags.map(([tag,count]) => {
              const ratio = (count-1)/(maxT-1||1)
              const size  = 0.7 + ratio * 0.8
              const alpha = 0.12 + ratio * 0.25
              const col   = dark ? `rgba(168,189,212,${0.7+ratio*0.3})` : `rgba(58,95,138,${0.75+ratio*0.25})`
              return (
                <span key={tag} title={`${count} project${count>1?'s':''}`}
                  style={{ display:'inline-flex',alignItems:'center',borderRadius:999,fontWeight:600,whiteSpace:'nowrap',cursor:'default',transition:'transform 0.15s',
                    fontSize:`${size}rem`, padding:`${0.25+ratio*0.25}rem ${(0.25+ratio*0.25)*1.8}rem`,
                    background:`rgba(139,163,199,${alpha})`, border:`1px solid rgba(139,163,199,${alpha+0.15})`, color:col }}
                  onMouseEnter={e=>(e.currentTarget.style.transform='scale(1.08)')}
                  onMouseLeave={e=>(e.currentTarget.style.transform='')}
                >{tag}</span>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
