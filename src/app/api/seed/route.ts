import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Project } from '@/lib/models/Project'
import { Certificate } from '@/lib/models/Certificate'
import { Setting } from '@/lib/models/Setting'

const INITIAL_PROJECTS = [
  {
    cat:'ml', year:'2026', featured:true, groupProject:false, status:'completed', dataScale:300000, useSvg:false, displayOrder:0,
    title:'Social Media Campaign Engagement Predictor',
    description:'Engineered marketing KPIs (CTR, CPC, CPM, ROAS) from <strong>300,000 raw ad campaign records</strong> across Facebook, Instagram, Pinterest and Twitter. Trained a Random Forest classifier achieving <strong>ROC-AUC 0.728</strong> — identifying CPC as the strongest predictor at 43% feature importance. Delivered platform-level business recommendations, identifying a critically underperforming channel costing 5× in lost revenue per campaign.',
    tags:['Python','pandas','numpy','scikit-learn','Random Forest','matplotlib','seaborn','Jupyter'],
    gh:'https://github.com/sanda0620/social-media-marketing-analytics', img:'',
  },
  {
    cat:'de', year:'2026', featured:true, groupProject:false, status:'completed', useSvg:false, displayOrder:1,
    title:'IoT Real-Time Streaming Pipeline',
    description:'Built a production-style real-time data pipeline simulating IoT sensor networks across <strong>5 locations</strong>. Streams 1 event/second through a 3-partition Apache Kafka topic into PostgreSQL with <strong>sub-5-second latency</strong>. Implemented producer/consumer architecture with data validation, fault-tolerant consumer groups, and end-to-end latency tracking. Live Grafana dashboard with 5-second auto-refresh. Fully containerised with Docker Compose.',
    tags:['Apache Kafka','Python','PostgreSQL','Grafana','Docker','Docker Compose'],
    gh:'https://github.com/sanda0620/iot-real-time-streaming-pipeline', img:'',
  },
  {
    cat:'de', year:'2026', featured:true, groupProject:false, status:'completed', useSvg:false, displayOrder:2,
    title:'Cryptocurrency Analytics ETL Pipeline',
    description:'Automated ETL pipeline ingesting live market data for <strong>BTC, ETH, BNB, SOL, ADA</strong> from the CoinGecko API on an hourly cron schedule. Designed a star schema data warehouse in PostgreSQL with SQLAlchemy-managed ingestion, separating raw, staging, and analytics-ready layers. Power BI dashboard surfacing price trends and market movement.',
    tags:['Python','PostgreSQL','pandas','SQLAlchemy','CoinGecko API','Power BI','cron'],
    gh:'https://github.com/sanda0620/crypto-analytics-etl-pipeline', img:'',
  },
  {
    cat:'de', year:'2026', featured:true, groupProject:false, status:'completed', dataScale:100000, useSvg:false, displayOrder:3,
    title:'Olist E-Commerce Data Warehouse',
    description:'End-to-end ETL pipeline transforming <strong>9 raw CSV files</strong> from the Olist Brazilian e-commerce dataset (<strong>100K+ orders</strong>) into a structured PostgreSQL data warehouse using star schema design. Automated the full pipeline with modular Python scripts. Delivered a 4-page Power BI dashboard covering executive KPIs, customer analytics, seller performance, and product insights.',
    tags:['Python','PostgreSQL','pandas','SQLAlchemy','Power BI','ETL','Star Schema'],
    gh:'https://github.com/sanda0620/olist-ecommerce-data-warehouse', img:'',
  },
  {
    cat:'dv', year:'2026', featured:true, groupProject:false, status:'completed', dataScale:9994, useSvg:false, displayOrder:4,
    title:'Superstore Sales Analysis (Python)',
    description:'EDA on <strong>9,994 retail orders</strong> uncovering profitability drivers. Found that heavy discounting causes average losses of <strong>$134 per order</strong>, Furniture margins trail Technology by 15%, and large orders are <strong>59× more profitable</strong> than small ones. Delivered actionable business recommendations backed by comprehensive visual storytelling.',
    tags:['Python','pandas','numpy','matplotlib','seaborn','Jupyter'],
    gh:'https://github.com/sanda0620/superstore-sales-analysis-python', img:'',
  },
  {
    cat:'dv', year:'2026', featured:true, groupProject:false, status:'completed', useSvg:false, displayOrder:5,
    title:'Superstore Sales Analysis (R)',
    description:'Executive-level BI analysis on retail transactional data using R. KPI dashboards covering revenue, profit margins, regional performance, and customer segmentation. Revealed that heavy discounting significantly erodes profit margins and that revenue is concentrated among a small customer cohort.',
    tags:['R','dplyr','ggplot2','lubridate','zoo','readxl','Jupyter'],
    gh:'https://github.com/sanda0620/superstore-sales-analysis-r', img:'',
  },
  {
    cat:'dv', year:'2026', featured:true, groupProject:false, status:'completed', useSvg:false, displayOrder:6,
    title:'Student Performance EDA',
    description:'EDA on student performance covering <strong>math, reading, and writing scores</strong> across demographic groups. Uncovered that reading and writing scores are highly correlated, female students outperform in literacy subjects, and math scores show the widest variation — all visualised using ggplot2 in R.',
    tags:['R','ggplot2','dplyr','RStudio'],
    gh:'https://github.com/sanda0620/student-performance-eda', img:'',
  },
  {
    cat:'da', year:'2026', featured:true, groupProject:true, status:'completed', dataScale:3000, useSvg:false, displayOrder:7,
    title:'CAHPS Health Plan Survey Analysis',
    description:'Group project analysing CAHPS Health Plan Survey data from <strong>3,000 respondents</strong> to test whether patients who feel listened to by healthcare staff report higher health plan satisfaction. Applied Kruskal-Wallis, Spearman correlation, and predictive modelling in R — reaching a well-evidenced null result. Presented via interactive React/Vite dashboard.',
    tags:['R','dplyr','ggplot2','Kruskal-Wallis','Spearman','React','Vite'],
    gh:'https://github.com/sanda0620/cahps-health-survey-analysis', img:'',
  },
  {
    cat:'wd', year:'2026', featured:true, groupProject:false, status:'completed', useSvg:false, displayOrder:8,
    title:'Smart Campus Operations Hub',
    description:'Full-stack campus management system for SLIIT (Spring Boot + React + MongoDB). My contribution: <strong>Google OAuth 2.0 + Two-Factor Auth (OTP email)</strong>, JWT issuance, real-time notifications via SSE with parallel email delivery, Notifications REST API, Audit Log, Admin Dashboard with Recharts analytics, and GitHub Actions CI/CD pipeline.',
    tags:['Java','Spring Boot','React.js','MongoDB','OAuth 2.0','JWT','Spring Security','SSE','GitHub Actions'],
    gh:'https://github.com/sanda0620/smart-campus-operations-hub', img:'',
  },
]

const INITIAL_CERTS = [
  { name:'MongoDB Data Modeling Path',  issuer:'MongoDB University · 2026', file:'', fileType:'', displayOrder:0 },
  { name:'MongoDB Basics for Students', issuer:'MongoDB University · 2026', file:'', fileType:'', displayOrder:1 },
  { name:'MongoDB Indexes',             issuer:'MongoDB University · 2026', file:'', fileType:'', displayOrder:2 },
]

const INITIAL_SKILLS = {
  lang: [
    { name:'Python (pandas, numpy, scikit-learn)', level:'expert' },
    { name:'R (dplyr, ggplot2, statistics)',       level:'advanced' },
    { name:'SQL / PostgreSQL / SQL Server',        level:'expert' },
    { name:'Java / Spring Boot / REST APIs',       level:'intermediate' },
    { name:'React.js / JavaScript / Node.js',      level:'intermediate' },
  ],
  data: [
    { name:'ETL / SSIS / SSAS / Star Schema', level:'advanced' },
    { name:'Apache Kafka (streaming)',         level:'advanced' },
    { name:'Power BI / Grafana',              level:'advanced' },
    { name:'Docker / GitHub Actions CI/CD',   level:'intermediate' },
    { name:'Machine Learning (RF, Regression)', level:'advanced' },
  ],
}

export async function POST(req: NextRequest) {
  if (req.headers.get('x-admin-password') !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    await connectDB()
    const existingCount = await Project.countDocuments()
    if (existingCount > 0) {
      return NextResponse.json({ message: 'Already seeded', count: existingCount })
    }
    await Project.insertMany(INITIAL_PROJECTS)
    await Certificate.insertMany(INITIAL_CERTS)
    await Setting.findOneAndUpdate({ key: 'skills' }, { key: 'skills', value: INITIAL_SKILLS }, { upsert: true })
    await Setting.findOneAndUpdate({ key: 'cv_url' }, { key: 'cv_url', value: '' }, { upsert: true })
    return NextResponse.json({ success: true, projects: INITIAL_PROJECTS.length, certs: INITIAL_CERTS.length })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
