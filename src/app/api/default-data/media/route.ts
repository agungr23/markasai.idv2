import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET() {
  try {
    const filePath = join(process.cwd(), 'data', 'media.json');
    const data = readFileSync(filePath, 'utf8');
    const mediaFiles = JSON.parse(data);
    
    return NextResponse.json(mediaFiles);
  } catch (error) {
    console.error('Error loading media files:', error);
    return NextResponse.json([], { status: 500 });
  }
}