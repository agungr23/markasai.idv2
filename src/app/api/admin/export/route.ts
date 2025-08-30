// API endpoint for exporting and importing JSON data (Edge Runtime compatible)
import { NextRequest, NextResponse } from 'next/server';
import { getStorageAdapter } from '@/lib/storage-adapter';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    const storage = await getStorageAdapter();

    if (type === 'all') {
      // Export all data
      const allData = {
        products: await storage.read('products', []),
        'blog-posts': await storage.read('blog-posts', []),
        'case-studies': await storage.read('case-studies', []),
        testimonials: await storage.read('testimonials', []),
        settings: await storage.read('settings', {})
      };

      return NextResponse.json(allData, {
        headers: {
          'Content-Disposition': 'attachment; filename="markasai-data-backup.json"',
          'Content-Type': 'application/json'
        }
      });
    }

    if (type && ['products', 'blog-posts', 'case-studies', 'testimonials', 'settings'].includes(type)) {
      const data = await storage.read(type, type === 'settings' ? {} : []);
      return NextResponse.json(data, {
        headers: {
          'Content-Disposition': `attachment; filename="${type}-backup.json"`,
          'Content-Type': 'application/json'
        }
      });
    }

    return NextResponse.json(
      { error: 'Invalid type. Use: products, blog-posts, case-studies, testimonials, settings, or all' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    
    if (!type || !['products', 'blog-posts', 'case-studies', 'testimonials', 'settings'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type. Use: products, blog-posts, case-studies, testimonials, or settings' },
        { status: 400 }
      );
    }

    const data = await request.json();
    const storage = await getStorageAdapter();
    
    await storage.write(type, data);

    return NextResponse.json({ 
      success: true, 
      message: `${type} data imported successfully` 
    });

  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json(
      { error: 'Failed to import data' },
      { status: 500 }
    );
  }
}