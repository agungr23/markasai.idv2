import { BlogPost, CaseStudy } from '@/types';

// In-memory storage for blog posts (will be replaced by file storage in API routes)
let blogPostsData: BlogPost[] = [];

// Default blog posts data
const defaultBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: '5 Cara AI Mengubah Landscape Marketing Digital di 2024',
    slug: '5-cara-ai-mengubah-marketing-digital-2024',
    excerpt: 'Pelajari bagaimana AI merevolusi strategi marketing digital dan cara memanfaatkannya untuk bisnis Anda.',
    cover: '/images/blog/ai-marketing-2024.jpg',
    body: `# 5 Cara AI Mengubah Landscape Marketing Digital di 2024

Artificial Intelligence (AI) telah menjadi game-changer dalam dunia marketing digital. Di tahun 2024, kita melihat transformasi yang luar biasa dalam cara bisnis berinteraksi dengan pelanggan dan mengoptimalkan strategi pemasaran mereka.

## 1. Personalisasi Konten yang Lebih Mendalam

AI memungkinkan personalisasi konten pada level yang belum pernah ada sebelumnya. Dengan menganalisis data perilaku pengguna, AI dapat:

- Menyesuaikan konten berdasarkan preferensi individual
- Menentukan waktu optimal untuk mengirim pesan
- Memprediksi produk yang paling mungkin dibeli

## 2. Chatbot dan Customer Service Otomatis

Layanan pelanggan 24/7 kini menjadi standar dengan AI chatbot yang semakin canggih:

- Respon instan untuk pertanyaan umum
- Routing otomatis ke departemen yang tepat
- Analisis sentimen untuk mendeteksi kepuasan pelanggan

## 3. Optimasi Iklan Real-time

AI mengoptimalkan kampanye iklan secara real-time:

- Penyesuaian bid otomatis berdasarkan performa
- Targeting audience yang lebih presisi
- A/B testing otomatis untuk copy dan visual

## 4. Predictive Analytics untuk Strategi

Prediksi tren dan perilaku konsumen menjadi lebih akurat:

- Forecasting demand produk
- Identifikasi customer churn
- Optimasi inventory dan pricing

## 5. Content Creation dan Copywriting

AI membantu dalam pembuatan konten:

- Generate copy marketing yang converting
- Optimasi SEO otomatis
- Pembuatan visual dan video

## Kesimpulan

AI bukan lagi masa depan - ini adalah kenyataan hari ini. Bisnis yang tidak mengadopsi AI dalam strategi marketing mereka akan tertinggal dari kompetitor yang sudah memanfaatkan teknologi ini.

Mulai integrasikan AI dalam strategi marketing Anda sekarang juga!`,
    publishedAt: '2024-01-15',
    author: {
      name: 'Tim MarkasAI',
      avatar: '/images/authors/team.jpg',
      bio: 'Tim ahli AI dan marketing digital di MarkasAI'
    },
    tags: ['AI', 'Marketing Digital', 'Teknologi', 'Bisnis'],
    status: 'published',
    seo: {
      title: '5 Cara AI Mengubah Marketing Digital 2024 | MarkasAI Blog',
      description: 'Pelajari 5 cara AI merevolusi marketing digital di 2024. Dari personalisasi hingga predictive analytics.',
      keywords: ['ai marketing', 'marketing digital', 'artificial intelligence', 'teknologi marketing']
    },
    readTime: 5
  },
  {
    id: '2',
    title: 'Panduan Lengkap Memulai Bisnis dengan AI untuk UMKM',
    slug: 'panduan-memulai-bisnis-ai-umkm',
    excerpt: 'Langkah-langkah praktis untuk UMKM yang ingin mengintegrasikan AI dalam operasional bisnis mereka.',
    cover: '/images/blog/umkm-ai-guide.jpg',
    body: `# Panduan Lengkap Memulai Bisnis dengan AI untuk UMKM

Sebagai UMKM, Anda mungkin merasa AI adalah teknologi yang terlalu kompleks atau mahal. Namun, kenyataannya AI dapat menjadi game-changer untuk bisnis kecil dan menengah.

## Mengapa UMKM Perlu AI?

### 1. Efisiensi Operasional
- Otomatisasi tugas repetitif
- Penghematan waktu dan biaya
- Fokus pada strategi bisnis

### 2. Kompetitif dengan Perusahaan Besar
- Akses ke teknologi canggih
- Layanan pelanggan yang lebih baik
- Marketing yang lebih efektif

## Langkah-langkah Memulai

### 1. Identifikasi Kebutuhan
Tentukan area mana yang paling membutuhkan otomatisasi:
- Customer service
- Marketing dan promosi
- Manajemen inventory
- Analisis data penjualan

### 2. Mulai dari yang Sederhana
Jangan langsung mengimplementasikan AI yang kompleks:
- Chatbot untuk customer service
- Auto-posting media sosial
- Email marketing otomatis

### 3. Pilih Tools yang User-Friendly
Pilih platform AI yang mudah digunakan:
- Interface yang intuitif
- Tutorial yang lengkap
- Support yang responsif

## Studi Kasus: Toko Online Pak Budi

Pak Budi memiliki toko online dengan 1000 produk. Setelah menggunakan AI:
- Customer service response time turun dari 2 jam ke 2 menit
- Conversion rate naik 150%
- Waktu untuk content creation berkurang 80%

## Tips Sukses Implementasi AI

1. **Mulai Kecil**: Jangan terburu-buru mengotomatisasi semua
2. **Training Tim**: Pastikan tim memahami cara menggunakan AI
3. **Monitor Hasil**: Ukur ROI dari implementasi AI
4. **Iterasi**: Terus perbaiki dan optimalkan

## Kesimpulan

AI bukan lagi privilege perusahaan besar. UMKM yang cerdas akan memanfaatkan AI untuk tumbuh dan bersaing di era digital ini.`,
    publishedAt: '2024-01-10',
    author: {
      name: 'Sarah Wijaya',
      avatar: '/images/authors/sarah.jpg',
      bio: 'Business Consultant dan AI Specialist di MarkasAI'
    },
    tags: ['UMKM', 'AI', 'Bisnis', 'Panduan'],
    status: 'published',
    seo: {
      title: 'Panduan Memulai Bisnis AI untuk UMKM | MarkasAI',
      description: 'Panduan lengkap UMKM mengintegrasikan AI dalam bisnis. Langkah praktis dan tips sukses implementasi.',
      keywords: ['umkm ai', 'bisnis ai', 'panduan ai', 'teknologi umkm']
    },
    readTime: 8
  }
];

// Initialize with default data
blogPostsData = [...defaultBlogPosts];

// Export functions to manage blog posts (client-side compatible)
export const getBlogPosts = (): BlogPost[] => {
  return [...blogPostsData];
};

export const addBlogPost = (post: BlogPost): void => {
  blogPostsData.push(post);
};

export const updateBlogPost = (id: string, updatedPost: Partial<BlogPost>): BlogPost | null => {
  const index = blogPostsData.findIndex(post => post.id === id);
  if (index === -1) return null;

  blogPostsData[index] = { ...blogPostsData[index], ...updatedPost };
  return blogPostsData[index];
};

export const deleteBlogPost = (id: string): boolean => {
  const index = blogPostsData.findIndex(post => post.id === id);
  if (index === -1) return false;

  blogPostsData.splice(index, 1);
  return true;
};

export const getBlogPostById = (id: string): BlogPost | undefined => {
  return blogPostsData.find(post => post.id === id);
};

export const getBlogPostBySlug = (slug: string): BlogPost | undefined => {
  return blogPostsData.find(post => post.slug === slug);
};

// For backward compatibility
export const blogPosts = blogPostsData;