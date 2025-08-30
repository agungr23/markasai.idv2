import { NextRequest, NextResponse } from 'next/server';
import { getTestimonials, addTestimonial } from '@/lib/storage-json-only';
import { Testimonial } from '@/types';

export async function GET() {
  try {
    const testimonials = await getTestimonials();
    
    return NextResponse.json({
      success: true,
      testimonials
    });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Generate ID and timestamp
    const testimonial: Testimonial = {
      ...body,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    // Validate required fields
    if (!testimonial.name || !testimonial.content || !testimonial.company) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    await addTestimonial(testimonial);
    
    return NextResponse.json({
      success: true,
      testimonial
    });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create testimonial' },
      { status: 500 }
    );
  }
}
