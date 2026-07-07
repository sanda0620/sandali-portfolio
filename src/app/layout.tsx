import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sandali Ruwanya — Data Science Portfolio',
  description: 'Data Science undergraduate at SLIIT. Building real-time pipelines, ML models, and BI dashboards.',
  keywords: ['Data Science', 'Machine Learning', 'Data Engineering', 'Power BI', 'Kafka', 'Portfolio'],
  openGraph: {
    title: 'Sandali Ruwanya — Data Science Portfolio',
    description: 'Data Science undergraduate at SLIIT building real-time pipelines, ML models, and BI dashboards.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}