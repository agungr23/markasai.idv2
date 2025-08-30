import { NextRequest, NextResponse } from 'next/server';
import { 
  getTestimonialByIdFromStorage, 
  saveTestimonialToStorage, 
  deleteTestimonialFromStorage 
} from '@/lib/testimonial-storage';
import { Testimonial } from '@/types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const testimonial = await getTestimonialByIdFromStorage(id);
    
    if (!testimonial) {
      return NextResponse.json(
        { success: false, error: 'Testimonial not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      testimonial
    });
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch testimonial' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Get existing testimonial to preserve createdAt
    const existingTestimonial = await getTestimonialByIdFromStorage(id);
    if (!existingTestimonial) {
      return NextResponse.json(
        { success: false, error: 'Testimonial not found' },
        { status: 404 }
      );
    }
    
    const updatedTestimonial: Testimonial = {
      ...body,
      id,
      createdAt: existingTestimonial.createdAt,
    };
    
    // Validate required fields
    if (!updatedTestimonial.name || !updatedTestimonial.content || !updatedTestimonial.company) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    await saveTestimonialToStorage(updatedTestimonial);
    
    return NextResponse.json({
      success: true,
      testimonial: updatedTestimonial
    });
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update testimonial' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    // Check if testimonial exists
    const existingTestimonial = await getTestimonialByIdFromStorage(id);
    if (!existingTestimonial) {
      return NextResponse.json(
        { success: false, error: 'Testimonial not found' },
        { status: 404 }
      );
    }
    
    await deleteTestimonialFromStorage(id);
    
    return NextResponse.json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete testimonial' },
      { status: 500 }
    );
  }
}
