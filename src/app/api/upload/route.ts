import { NextRequest, NextResponse } from 'next/server'
import { uploadToCloudinary } from '@/lib/cloudinary'

export async function POST(req: NextRequest) {
  if (req.headers.get('x-admin-password') !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const folder = (formData.get('folder') as string) || 'portfolio'

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    const bytes  = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const name   = file.name.replace(/\.[^/.]+$/, '').replace(/\s+/g, '-')
    const isPdf  = file.type === 'application/pdf'

    const url = await uploadToCloudinary(
      buffer, `${folder}/${name}-${Date.now()}`,
      folder, isPdf ? 'raw' : 'image'
    )
    return NextResponse.json({ url })
  } catch (e: any) {
    console.error('Upload error:', e)
    return NextResponse.json({ error: e.message || 'Upload failed' }, { status: 500 })
  }
}
