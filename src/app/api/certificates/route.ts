import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Certificate } from '@/lib/models/Certificate'

export async function GET() {
  try {
    await connectDB()
    const certs = await Certificate.find({}).sort({ displayOrder: 1, createdAt: 1 })
    return NextResponse.json(certs)
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch certificates' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  if (req.headers.get('x-admin-password') !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    await connectDB()
    const body = await req.json()
    const count = await Certificate.countDocuments()
    const cert = await Certificate.create({ ...body, displayOrder: count })
    return NextResponse.json(cert, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create certificate' }, { status: 500 })
  }
}
