import { NextRequest, NextResponse } from 'next/server';

// Type definition for contact form data
interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
  userAgent: string;
}

// Type definition for email subjects
type EmailSubject = 
  | 'booking' 
  | 'collaboration' 
  | 'interview' 
  | 'remix' 
  | 'licensing' 
  | 'press' 
  | 'general' 
  | 'technical';

const subjectLabels: Record<EmailSubject, string> = {
  booking: 'Event Booking Request',
  collaboration: 'Music Collaboration Inquiry',
  interview: 'Interview Request',
  remix: 'Remix Request',
  licensing: 'Music Licensing Inquiry',
  press: 'Press & Media Request',
  general: 'General Inquiry',
  technical: 'Technical Support'
};

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();
    
    // Validate required fields
    const { firstName, lastName, email, subject, message } = body;
    
    if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Validate message length
    if (message.trim().length < 10) {
      return NextResponse.json(
        { message: 'Message must be at least 10 characters long' },
        { status: 400 }
      );
    }

    // Rate limiting - simple IP-based check (in production, use Redis or similar)
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
    
    // TODO: Implement proper rate limiting
    // For now, we'll just log the attempt
    console.log(`Contact form submission from IP: ${clientIP}`);

    // Prepare email data
    const emailData = {
      to: ['admin@rudybtz.com', 'rudybtz@gmail.com'], // Admin emails
      replyTo: email,
      subject: `[RudyBTZ Portfolio] ${subjectLabels[subject as EmailSubject] || 'New Contact'}`,
      html: generateEmailHTML(body),
      text: generateEmailText(body)
    };

    // TODO: Send email using Firebase Functions or email service
    // This will be implemented by Gemini AI
    console.log('Email data prepared:', {
      ...emailData,
      html: '[HTML content]',
      text: '[Text content]'
    });

    // For now, simulate email sending
    await simulateEmailSending(emailData);

    // TODO: Store in Firestore for admin dashboard
    // This will be added later for contact management

    return NextResponse.json(
      { 
        message: 'Message sent successfully',
        id: generateMessageId(),
        status: 'delivered'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form API error:', error);
    
    return NextResponse.json(
      { message: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}

// Generate HTML email template
function generateEmailHTML(data: ContactFormData): string {
  const { firstName, lastName, email, subject, message, timestamp } = data;
  
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Form Submission</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #8B5CF6, #EC4899); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f8f9fa; padding: 20px; border: 1px solid #dee2e6; }
        .footer { background: #6c757d; color: white; padding: 15px; border-radius: 0 0 8px 8px; text-align: center; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #495057; }
        .value { margin-top: 5px; padding: 8px; background: white; border-radius: 4px; border: 1px solid #ced4da; }
        .message { min-height: 100px; }
        .metadata { font-size: 12px; color: #6c757d; margin-top: 20px; padding-top: 20px; border-top: 1px solid #dee2e6; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎵 New Contact Form Submission</h1>
            <p>RudyBTZ Portfolio Website</p>
        </div>
        
        <div class="content">
            <div class="field">
                <div class="label">From:</div>
                <div class="value">${firstName} ${lastName}</div>
            </div>
            
            <div class="field">
                <div class="label">Email:</div>
                <div class="value">${email}</div>
            </div>
            
            <div class="field">
                <div class="label">Subject:</div>
                <div class="value">${subjectLabels[subject as EmailSubject] || subject}</div>
            </div>
            
            <div class="field">
                <div class="label">Message:</div>
                <div class="value message">${message.replace(/\n/g, '<br>')}</div>
            </div>
            
            <div class="metadata">
                <div><strong>Submitted:</strong> ${new Date(timestamp).toLocaleString()}</div>
                <div><strong>User Agent:</strong> ${data.userAgent}</div>
            </div>
        </div>
        
        <div class="footer">
            <p>This message was sent through the RudyBTZ portfolio contact form.</p>
            <p>Reply directly to this email to respond to ${firstName}.</p>
        </div>
    </div>
</body>
</html>`;
}

// Generate plain text email
function generateEmailText(data: ContactFormData): string {
  const { firstName, lastName, email, subject, message, timestamp } = data;
  
  return `
NEW CONTACT FORM SUBMISSION - RudyBTZ Portfolio

From: ${firstName} ${lastName}
Email: ${email}
Subject: ${subjectLabels[subject as EmailSubject] || subject}

Message:
${message}

---
Submitted: ${new Date(timestamp).toLocaleString()}
User Agent: ${data.userAgent}

This message was sent through the RudyBTZ portfolio contact form.
Reply directly to this email to respond to ${firstName}.
`;
}

// Simulate email sending (will be replaced with real implementation)
async function simulateEmailSending(emailData: any): Promise<void> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  // Simulate occasional failures (5% chance)
  if (Math.random() < 0.05) {
    throw new Error('Email service temporarily unavailable');
  }
  
  console.log('📧 Email sent successfully (simulated)');
}

// Generate unique message ID
function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Handle OPTIONS for CORS (if needed)
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}