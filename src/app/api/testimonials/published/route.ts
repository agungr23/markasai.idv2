import { NextResponse } from 'next/server';
import { getTestimonials } from '@/lib/storage-json-only';

export async function GET() {
  try {
    const allTestimonials = await getTestimonials();
    // Filter published testimonials
    const publishedTestimonials = allTestimonials.filter(testimonial => 
      testimonial.status === 'published'
    );
    
    return NextResponse.json({
      success: true,
      testimonials: publishedTestimonials
    });
  } catch (error) {
    console.error('Error fetching published testimonials:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch published testimonials' },
      { status: 500 }
    );
  }
}
