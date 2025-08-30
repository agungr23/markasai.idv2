import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const leadSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Format email tidak valid'),
  phone: z.string().optional(),
  company: z.string().optional(),
  message: z.string().min(10, 'Pesan minimal 10 karakter'),
  source: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const validatedData = leadSchema.parse(body);
    
    // Log the lead data (in production, you'd save to database or send to CRM)
    console.log('New lead received:', {
      ...validatedData,
      timestamp: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    });

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In a real application, you would:
    // 1. Save to database (e.g., PostgreSQL, MongoDB)
    // 2. Send to CRM (e.g., HubSpot, Salesforce)
    // 3. Send notification email to sales team
    // 4. Add to email marketing list
    // 5. Send auto-reply email to lead

    // Example of what you might do:
    /*
    // Save to database
    await db.leads.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        company: validatedData.company,
        message: validatedData.message,
        source: validatedData.source,
        createdAt: new Date(),
      }
    });

    // Send notification to sales team
    await sendEmail({
      to: 'sales@markasai.id',
      subject: `New Lead: ${validatedData.name}`,
      html: `
        <h2>New Lead Received</h2>
        <p><strong>Name:</strong> ${validatedData.name}</p>
        <p><strong>Email:</strong> ${validatedData.email}</p>
        <p><strong>Phone:</strong> ${validatedData.phone || 'Not provided'}</p>
        <p><strong>Company:</strong> ${validatedData.company || 'Not provided'}</p>
        <p><strong>Message:</strong> ${validatedData.message}</p>
        <p><strong>Source:</strong> ${validatedData.source || 'Unknown'}</p>
      `
    });

    // Send auto-reply to lead
    await sendEmail({
      to: validatedData.email,
      subject: 'Terima kasih telah menghubungi MarkasAI',
      html: `
        <h2>Halo ${validatedData.name},</h2>
        <p>Terima kasih telah menghubungi MarkasAI. Tim kami akan segera menghubungi Anda dalam 24 jam.</p>
        <p>Salam,<br>Tim MarkasAI</p>
      `
    });
    */

    return NextResponse.json(
      { 
        success: true, 
        message: 'Lead berhasil diterima. Tim kami akan menghubungi Anda segera.' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing lead:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Data tidak valid',
          errors: error.issues
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        message: 'Terjadi kesalahan server. Silakan coba lagi.' 
      },
      { status: 500 }
    );
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { message: 'Lead API endpoint. Use POST to submit leads.' },
    { status: 405 }
  );
}
