// API untuk mengelola storage dan backup JSON
import { NextRequest, NextResponse } from 'next/server';
import { getStorageAdapter } from '@/lib/storage-adapter';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const type = searchParams.get('type');

    const storage = await getStorageAdapter();

    switch (action) {
      case 'backup':
        // Export data sebagai backup JSON
        if (type === 'all') {
          const allData = {
            products: await storage.read('products', []),
            'blog-posts': await storage.read('blog-posts', []),
            'case-studies': await storage.read('case-studies', []),
            testimonials: await storage.read('testimonials', []),
            settings: await storage.read('settings', {}),
            timestamp: new Date().toISOString()
          };

          return NextResponse.json(allData, {
            headers: {
              'Content-Disposition': 'attachment; filename=\"markasai-backup.json\"',
              'Content-Type': 'application/json'
            }
          });
        }

        if (type && ['products', 'blog-posts', 'case-studies', 'testimonials', 'settings'].includes(type)) {
          const data = await storage.read(type, type === 'settings' ? {} : []);
          return NextResponse.json(data, {
            headers: {
              'Content-Disposition': `attachment; filename=\"${type}-backup.json\"`,
              'Content-Type': 'application/json'
            }
          });
        }

        return NextResponse.json({ error: 'Tipe tidak valid. Gunakan: products, blog-posts, case-studies, testimonials, settings, atau all' }, { status: 400 });

      case 'status':
        // Cek status storage
        const statusInfo = {
          timestamp: new Date().toISOString(),
          storage_type: 'hybrid', // JSON file + memory fallback
          data_counts: {
            products: (await storage.read('products', [])).length,
            'blog-posts': (await storage.read('blog-posts', [])).length,
            'case-studies': (await storage.read('case-studies', [])).length,
            testimonials: (await storage.read('testimonials', [])).length,
            settings: Object.keys(await storage.read('settings', {})).length
          }
        };

        return NextResponse.json(statusInfo);

      default:
        return NextResponse.json({ 
          error: 'Action tidak valid',
          available_actions: ['backup', 'status'],
          usage: {
            backup: '/api/storage?action=backup&type=all',
            status: '/api/storage?action=status'
          }
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Storage API error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const type = searchParams.get('type');

    if (action === 'restore' && type) {
      if (!['products', 'blog-posts', 'case-studies', 'testimonials', 'settings'].includes(type)) {
        return NextResponse.json({ error: 'Tipe tidak valid' }, { status: 400 });
      }

      const data = await request.json();
      const storage = await getStorageAdapter();
      
      await storage.write(type, data);

      return NextResponse.json({ 
        success: true, 
        message: `Data ${type} berhasil di-restore`,
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json({ error: 'Action tidak valid' }, { status: 400 });

  } catch (error) {
    console.error('Storage restore error:', error);
    return NextResponse.json({ error: 'Gagal restore data' }, { status: 500 });
  }
}