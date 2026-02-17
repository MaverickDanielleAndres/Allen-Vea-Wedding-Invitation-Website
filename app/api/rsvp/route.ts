import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(request: Request) {
  try {
    // Validate API key and email
    const apiKey = process.env.RESEND_API_KEY
    const fromEmail = process.env.RESEND_FROM_EMAIL

    if (!apiKey) {
      console.error('RESEND_API_KEY is not set')
      return NextResponse.json(
        { error: 'Email service not configured (missing API key)' },
        { status: 500 }
      )
    }

    if (!fromEmail) {
      console.error('RESEND_FROM_EMAIL is not set')
      return NextResponse.json(
        { error: 'Email service not configured (missing from email)' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { name, email, attending, guests, dietary, message } = body

    // Validate required fields
    if (!name || !email || !attending) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, and attendance response are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    // Validate name length
    if (name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Please enter a valid name' },
        { status: 400 }
      )
    }

    const resend = new Resend(apiKey)

    // Send email to the couple
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: fromEmail,
      replyTo: email,
      subject: `Wedding RSVP from ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .container {
                background: #f9f9f9;
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                padding: 30px;
              }
              .header {
                background: linear-gradient(135deg, #8CA88E 0%, #7A9E7E 100%);
                color: white;
                padding: 20px;
                border-radius: 8px 8px 0 0;
                text-align: center;
                margin: -30px -30px 20px -30px;
              }
              .header h1 {
                margin: 0;
                font-size: 24px;
                font-weight: 600;
              }
              .field {
                margin-bottom: 15px;
                padding: 12px;
                background: white;
                border-radius: 4px;
                border-left: 3px solid #8CA88E;
              }
              .field-label {
                font-weight: 600;
                color: #555;
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 5px;
              }
              .field-value {
                color: #333;
                font-size: 16px;
              }
              .status-badge {
                display: inline-block;
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 14px;
                font-weight: 600;
                margin-top: 5px;
              }
              .status-yes {
                background: #d1f4dd;
                color: #0d7a3f;
              }
              .status-no {
                background: #fce4e4;
                color: #c41e3a;
              }
              .status-philippines {
                background: #d1f4dd;
                color: #0d7a3f;
              }
              .message-box {
                background: #fff8e1;
                border: 1px solid #ffd54f;
                border-radius: 4px;
                padding: 15px;
                margin-top: 15px;
                font-style: italic;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>💌 New Wedding RSVP</h1>
              </div>
              
              <div class="field">
                <div class="field-label">Guest Name</div>
                <div class="field-value">${name}</div>
              </div>

              <div class="field">
                <div class="field-label">Email Address</div>
                <div class="field-value">${email}</div>
              </div>

              <div class="field">
                <div class="field-label">Attendance</div>
                <div class="field-value">
                  <span class="status-badge ${attending === 'yes' ? 'status-yes' : attending === 'no' ? 'status-no' : 'status-philippines'}">
                    ${attending === 'yes' ? '✓ Joyfully Accepting' : attending === 'no' ? '✗ Regretfully Declining' : '🌴 Can\'t make it (Philippines)'}
                  </span>
                </div>
              </div>

              <div class="field">
                <div class="field-label">Number of Guests</div>
                <div class="field-value">${guests}</div>
              </div>

              ${dietary ? `
              <div class="field">
                <div class="field-label">Dietary Restrictions</div>
                <div class="field-value">${dietary}</div>
              </div>
              ` : ''}

              ${message ? `
              <div class="message-box">
                <div class="field-label">Personal Message</div>
                <div style="margin-top: 8px;">${message}</div>
              </div>
              ` : ''}
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('Resend email error:', JSON.stringify(error, null, 2))
      return NextResponse.json(
        { error: `Failed to send email: ${error.message || 'Unknown error'}` },
        { status: 500 }
      )
    }

    if (!data) {
      console.error('No response data from Resend')
      return NextResponse.json(
        { error: 'Failed to send email - no response from email service' },
        { status: 500 }
      )
    }

    console.log('RSVP email sent successfully:', data.id)
    return NextResponse.json({ success: true, messageId: data.id })
  } catch (error) {
    console.error('API error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json(
      { error: `Failed to process your request: ${errorMessage}` },
      { status: 500 }
    )
  }
}
