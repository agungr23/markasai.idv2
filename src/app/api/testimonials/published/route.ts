import { NextResponse } from 'next/server';
import { getPublishedTestimonialsFromStorage } from '@/lib/testimonial-storage';

export async function GET() {
  try {
    const testimonials = await getPublishedTestimonialsFromStorage();
    
    return NextResponse.json({
      success: true,
      testimonials
    });
  } catch (error) {
    console.error('Error fetching published testimonials:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch published testimonials' },
      { status: 500 }
    );
  }
}
