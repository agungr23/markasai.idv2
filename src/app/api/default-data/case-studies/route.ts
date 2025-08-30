import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET() {
  try {
    const filePath = join(process.cwd(), 'data', 'case-studies.json');
    const data = readFileSync(filePath, 'utf8');
    const caseStudies = JSON.parse(data);
    
    return NextResponse.json(caseStudies);
  } catch (error) {
    console.error('Error loading case studies:', error);
    return NextResponse.json([], { status: 500 });
  }
}