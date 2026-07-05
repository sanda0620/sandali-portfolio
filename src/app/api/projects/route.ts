import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Project } from '@/lib/models/Project'

export async function GET() {
  try {
    await connectDB()
    const projects = await Project.find({}).sort({ displayOrder: 1, createdAt: 1 })
    return NextResponse.json(projects)
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const pw = req.headers.get('x-admin-password')
    if (pw !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    await connectDB()
    const body = await req.json()
    const count = await Project.countDocuments()
    const project = await Project.create({ ...body, displayOrder: count })
    return NextResponse.json(project, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}
