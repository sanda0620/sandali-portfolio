import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Setting } from '@/lib/models/Setting'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const key = searchParams.get('key')
    if (key) {
      const setting = await Setting.findOne({ key })
      return NextResponse.json(setting ? setting.value : null)
    }
    const all = await Setting.find({})
    const obj: Record<string, any> = {}
    all.forEach(s => { obj[s.key] = s.value })
    return NextResponse.json(obj)
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  if (req.headers.get('x-admin-password') !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    await connectDB()
    const { key, value } = await req.json()
    await Setting.findOneAndUpdate({ key }, { key, value }, { upsert: true, new: true })
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to save setting' }, { status: 500 })
  }
}
