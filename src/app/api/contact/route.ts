import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json()
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const RESEND_KEY = process.env.RESEND_API_KEY
    if (!RESEND_KEY || RESEND_KEY.startsWith('re_placeholder')) {
      // Fallback — log and return success so form doesn't break during dev
      console.log('Contact form submission (Resend not configured):', { name, email, subject, message })
      return NextResponse.json({ success: true, note: 'Resend not configured' })
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_KEY}`,
      },
      body: JSON.stringify({
        from:    'Portfolio Contact <onboarding@resend.dev>',
        to:      ['ruwanyasandali@gmail.com'],
        subject: subject || `Portfolio contact from ${name}`,
        html: `
          <h2>New message from your portfolio</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject || 'No subject'}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `,
        reply_to: email,
      }),
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || 'Resend error')
    }

    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
