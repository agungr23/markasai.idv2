// API untuk menyediakan default data tanpa file system access
import { NextRequest, NextResponse } from 'next/server';

// Import default data dari modules
import { products } from '@/data/products';

// Default data untuk berbagai jenis konten
const defaultData = {
  'blog-posts': [
    {
      id: '1',
      title: '5 Cara AI Mengubah Landscape Marketing Digital di 2024',
      slug: '5-cara-ai-mengubah-marketing-digital-2024',
      excerpt: 'Pelajari bagaimana AI merevolusi strategi marketing digital dan cara memanfaatkannya untuk bisnis Anda.',
      cover: '/images/blog/ai-marketing-2024.jpg',
      body: `# 5 Cara AI Mengubah Landscape Marketing Digital di 2024

Artificial Intelligence (AI) telah mengubah cara kita berbisnis, terutama dalam dunia marketing digital. Di tahun 2024, AI bukan lagi sekadar tren, melainkan kebutuhan untuk tetap kompetitif.

## 1. Personalisasi Konten yang Lebih Cerdas
AI memungkinkan personalisasi konten pada level yang belum pernah ada sebelumnya.

## 2. Chatbot dan Customer Service Otomatis
Chatbot AI modern dapat menangani 90% pertanyaan customer tanpa intervensi manusia.

## 3. Predictive Analytics untuk Campaign
AI membantu marketer memprediksi tren pasar yang akan datang.

## 4. Automated Content Creation
AI dapat membantu menulis copy iklan yang converting.

## 5. Voice Search Optimization
Dengan meningkatnya penggunaan voice assistant, optimasi menjadi penting.`,
      publishedAt: '2024-01-15',
      author: {
        name: 'Tim MarkasAI',
        avatar: '/images/team/markasai-team.jpg',
        bio: 'Tim ahli AI dan digital marketing di MarkasAI'
      },
      tags: ['AI', 'Marketing Digital', 'Teknologi', 'Bisnis'],
      status: 'published',
      readTime: 5,
      seo: {
        title: '5 Cara AI Mengubah Marketing Digital 2024 | MarkasAI',
        description: 'Pelajari bagaimana AI merevolusi strategi marketing digital dan cara memanfaatkannya untuk bisnis Anda di tahun 2024.',
        keywords: ['ai marketing', 'marketing digital', 'artificial intelligence', 'teknologi marketing']
      }
    }
  ],
  
  'case-studies': [
    {
      id: '1',
      title: 'Transformasi Digital UMKM dengan AI',
      slug: 'transformasi-digital-umkm-ai',
      excerpt: 'Bagaimana UMKM meningkatkan penjualan 300% dengan implementasi AI.',
      cover: '/images/case-studies/umkm-transformation.jpg',
      client: 'Toko Elektronik Modern',
      industry: 'Retail',
      challenge: 'Penjualan menurun dan kesulitan kompetisi dengan marketplace besar',
      solution: 'Implementasi AI untuk rekomendasi produk dan chatbot customer service',
      results: [
        'Peningkatan penjualan 300%',
        'Customer satisfaction naik 85%',
        'Efisiensi operasional 60%'
      ],
      body: `# Transformasi Digital UMKM dengan AI

## Latar Belakang
Toko Elektronik Modern adalah UMKM yang bergerak di bidang retail elektronik...`,
      publishedAt: '2024-01-12',
      featured: true,
      tags: ['UMKM', 'AI', 'Retail', 'Case Study']
    }
  ],
  
  'testimonials': [
    {
      id: '1',
      name: 'Budi Santoso',
      company: 'TechStart Indonesia',
      position: 'CEO',
      content: 'MarkasAI telah membantu kami meningkatkan efisiensi bisnis hingga 80%. Tim yang profesional dan solusi yang inovatif.',
      rating: 5,
      avatar: '/images/testimonials/budi-santoso.jpg',
      featured: true,
      createdAt: '2024-01-10'
    },
    {
      id: '2', 
      name: 'Sari Wijayanti',
      company: 'Digital Agency Pro',
      position: 'Marketing Director',
      content: 'Solusi AI dari MarkasAI sangat mudah digunakan dan memberikan hasil yang luar biasa untuk klien kami.',
      rating: 5,
      avatar: '/images/testimonials/sari-wijayanti.jpg',
      featured: true,
      createdAt: '2024-01-08'
    }
  ],
  
  'settings': {
    siteTitle: 'MarkasAI.ID - Platform AI Terdepan Indonesia',
    siteDescription: 'Solusi AI terdepan untuk transformasi digital bisnis Anda',
    contactEmail: 'hello@markasai.id',
    phone: '+62 812-3456-7890',
    address: 'Jakarta, Indonesia',
    socialMedia: {
      instagram: '@markasai.id',
      linkedin: 'MarkasAI',
      youtube: '@MarkasAI',
      twitter: '@markasai_id'
    },
    businessHours: {
      weekdays: '09:00 - 18:00 WIB',
      saturday: '09:00 - 15:00 WIB',
      sunday: 'Tutup'
    }
  }
};

export async function GET(
  request: NextRequest,
  { params }: { params: { type: string } }
) {
  try {
    const type = params.type;
    
    if (type === 'products') {
      return NextResponse.json(products);
    }
    
    if (defaultData[type as keyof typeof defaultData]) {
      return NextResponse.json(defaultData[type as keyof typeof defaultData]);
    }
    
    return NextResponse.json({ error: 'Data type tidak ditemukan' }, { status: 404 });
    
  } catch (error) {
    console.error('Default data API error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}