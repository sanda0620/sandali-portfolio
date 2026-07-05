'use client'

import { useState, useEffect } from 'react'
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import KpiCards from '@/components/KpiCards'
import About from '@/components/About'
import Projects from '@/components/Projects'
import Skills from '@/components/Skills'
import Insights from '@/components/Insights'
import Contact from '@/components/Contact'
import AdminPanel from '@/components/AdminPanel'
import FloatingButtons from '@/components/FloatingButtons'
import CertModal from '@/components/CertModal'
import ProjectModal from '@/components/ProjectModal'
import CvModal from '@/components/CvModal'

export type Project = {
  _id: string
  cat: string
  year: string
  title: string
  description: string
  tags: string[]
  gh: string
  img: string
  featured: boolean
  groupProject: boolean
  status: string
  dataScale?: number
  useSvg: boolean
  displayOrder: number
}

export type Certificate = {
  _id: string
  name: string
  issuer: string
  file: string
  fileType: string
  displayOrder: number
}

export type Settings = {
  cv_url?: string
  skills?: {
    lang: { name: string; level: string }[]
    data: { name: string; level: string }[]
  }
}

export default function Home() {
  const [projects, setProjects]   = useState<Project[]>([])
  const [certs, setCerts]         = useState<Certificate[]>([])
  const [settings, setSettings]   = useState<Settings>({ cv_url: '', skills: undefined })
  const [loading, setLoading]     = useState(true)
  const [dark, setDark]           = useState(true)
  const [adminOpen, setAdminOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [selectedCert, setSelectedCert]       = useState<Certificate | null>(null)
  const [cvOpen, setCvOpen]       = useState(false)

  // Theme memory
  useEffect(() => {
    const saved = localStorage.getItem('sr_theme') || 'dark'
    setDark(saved === 'dark')
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
    localStorage.setItem('sr_theme', dark ? 'dark' : 'light')
  }, [dark])

  // Fetch all data on mount
  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    try {
      const [projRes, certRes, settRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/certificates'),
        fetch('/api/settings'),
      ])

      const [projData, certData, settData] = await Promise.all([
        projRes.json(),
        certRes.json(),
        settRes.json(),
      ])

      console.log('Loaded projects:', projData?.length)
      console.log('Loaded certs:', certData?.length)
      console.log('Loaded settings:', settData)

      if (Array.isArray(projData)) setProjects(projData)
      if (Array.isArray(certData)) setCerts(certData)
      if (settData && typeof settData === 'object') setSettings(settData)
    } catch (e) {
      console.error('Failed to load data:', e)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#3a3d42', fontFamily: 'DM Sans, sans-serif', color: '#eceef2',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Sandali Ruwanya
          </div>
          <div style={{ color: 'rgba(236,238,242,0.5)', fontSize: '0.85rem' }}>Loading portfolio...</div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Nav dark={dark} setDark={setDark} />
      <Hero cvOpen={() => setCvOpen(true)} />
      <KpiCards projects={projects} />
      <About settings={settings} />
      <Projects projects={projects} onSelectProject={setSelectedProject} />
      <Skills certs={certs} settings={settings} onSelectCert={setSelectedCert} />
      <Insights projects={projects} dark={dark} />
      <Contact />
      <FloatingButtons onAdminOpen={() => setAdminOpen(true)} />

      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
      {selectedCert && (
        <CertModal cert={selectedCert} onClose={() => setSelectedCert(null)} />
      )}
      {cvOpen && (
        <CvModal cvUrl={settings.cv_url || ''} onClose={() => setCvOpen(false)} />
      )}
      {adminOpen && (
        <AdminPanel
          projects={projects}
          certs={certs}
          settings={settings}
          onClose={() => setAdminOpen(false)}
          onRefresh={loadData}
        />
      )}
    </>
  )
}