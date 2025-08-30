import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET() {
  try {
    const filePath = join(process.cwd(), 'data', 'settings.json');
    const data = readFileSync(filePath, 'utf8');
    const settings = JSON.parse(data);
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error loading settings:', error);
    return NextResponse.json({}, { status: 500 });
  }
}