import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET() {
  try {
    const filePath = join(process.cwd(), 'data', 'blog-posts.json');
    const data = readFileSync(filePath, 'utf8');
    const blogPosts = JSON.parse(data);
    
    return NextResponse.json(blogPosts);
  } catch (error) {
    console.error('Error loading blog posts:', error);
    return NextResponse.json([], { status: 500 });
  }
}