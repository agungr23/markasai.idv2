import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET() {
  try {
    const filePath = join(process.cwd(), 'data', 'testimonials.json');
    const data = readFileSync(filePath, 'utf8');
    const testimonials = JSON.parse(data);
    
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error('Error loading testimonials:', error);
    return NextResponse.json([], { status: 500 });
  }
}