import { CaseStudy } from '@/types';
import { getStorageAdapter } from './storage-adapter';

// Default case studies data
const defaultCaseStudies: CaseStudy[] = [
  {
    id: '1',
    title: 'TokoBudi.com: Meningkatkan Penjualan 300% dengan AI',
    slug: 'tokobudi-meningkatkan-penjualan-300-persen',
    summary: 'Bagaimana TokoBudi.com menggunakan AI untuk meningkatkan penjualan online mereka hingga 300% dalam 6 bulan.',
    logo: '/images/case-studies/tokobudi-logo.png',
    client: 'TokoBudi.com',
    industry: 'E-commerce',
    publishedAt: '2024-01-20',
    metrics: [
      {
        label: 'Peningkatan Penjualan',
        value: '300%',
        description: 'Dalam 6 bulan pertama'
      },
      {
        label: 'Response Time',
        value: '2 menit',
        description: 'Dari 2 jam sebelumnya'
      },
      {
        label: 'Customer Satisfaction',
        value: '95%',
        description: 'Rating kepuasan pelanggan'
      }
    ],
    body: `# TokoBudi.com: Transformasi Digital dengan AI

## Latar Belakang

TokoBudi.com adalah toko online yang menjual produk elektronik dan gadget. Dengan 5000+ produk dan 100+ transaksi per hari, mereka menghadapi tantangan dalam:

- Customer service yang lambat
- Konversi yang rendah
- Manajemen inventory yang manual

## Solusi yang Diimplementasikan

### 1. AI Customer Support
- Chatbot WhatsApp 24/7
- Auto-reply untuk pertanyaan umum
- Routing ke sales team untuk pertanyaan kompleks

### 2. AI Copy & Marketing
- Product description otomatis
- Social media content generation
- Email marketing personalization

### 3. AI Business Assistant
- Inventory forecasting
- Sales analytics
- Customer behavior analysis

## Hasil yang Dicapai

Dalam 6 bulan implementasi, TokoBudi.com berhasil mencapai:
- **300% peningkatan penjualan** dari Rp 50 juta menjadi Rp 200 juta per bulan
- **Response time 2 menit** dari sebelumnya 2 jam
- **95% customer satisfaction** rating
- **50% pengurangan biaya operasional**

## Testimoni

"AI dari MarkasAI benar-benar mengubah bisnis kami. Sekarang kami bisa fokus pada strategi bisnis, sementara AI menangani operasional harian." - Budi Santoso, Founder TokoBudi.com`,
    seo: {
      title: 'Case Study: TokoBudi.com Meningkatkan Penjualan 300% dengan AI',
      description: 'Pelajari bagaimana TokoBudi.com menggunakan AI untuk meningkatkan penjualan online hingga 300% dalam 6 bulan.',
      keywords: ['case study', 'ai ecommerce', 'peningkatan penjualan', 'tokobudi', 'markasai']
    },
    status: 'published'
  },
  {
    id: '2',
    title: 'PT Maju Jaya: Otomasi Marketing ROI 300%',
    slug: 'pt-maju-jaya-ai-marketing-automation',
    summary: 'Implementasi AI untuk otomasi campaign marketing yang menghasilkan ROI 300% dalam 6 bulan.',
    logo: '/images/case-studies/maju-jaya-logo.png',
    client: 'PT Maju Jaya',
    industry: 'Manufacturing',
    publishedAt: '2024-01-10',
    metrics: [
      {
        label: 'Marketing ROI',
        value: '+300%',
        description: 'Dalam 6 bulan pertama'
      },
      {
        label: 'Lead Generation',
        value: '+150%',
        description: 'Peningkatan qualified leads'
      },
      {
        label: 'Campaign Efficiency',
        value: '+200%',
        description: 'Efisiensi campaign management'
      }
    ],
    body: `# PT Maju Jaya: Otomasi Marketing ROI 300%

## Background
PT Maju Jaya adalah perusahaan manufaktur yang ingin meningkatkan efektivitas marketing digital mereka.

## Implementation
- AI-powered lead scoring
- Automated email campaigns
- Social media content automation
- Performance analytics dashboard

## Results
Marketing ROI meningkat 300% dengan lead generation yang lebih qualified dan campaign management yang efisien.`,
    seo: {
      title: 'Case Study: PT Maju Jaya Otomasi Marketing ROI 300%',
      description: 'Implementasi AI untuk otomasi campaign marketing yang menghasilkan ROI 300% dalam 6 bulan.',
      keywords: ['case study', 'ai marketing', 'marketing automation', 'roi', 'manufacturing']
    },
    status: 'published'
  },
  {
    id: '3',
    title: 'Klinik Sehat: AI Assistant 24/7 Patient Care',
    slug: 'klinik-sehat-ai-customer-support',
    summary: 'Klinik Sehat menggunakan AI assistant untuk menangani appointment booking dan pertanyaan pasien 24/7.',
    logo: '/images/case-studies/klinik-sehat-logo.png',
    client: 'Klinik Sehat',
    industry: 'Healthcare',
    publishedAt: '2024-01-05',
    metrics: [
      {
        label: 'Appointment Booking',
        value: '+80%',
        description: 'Peningkatan booking otomatis'
      },
      {
        label: 'Patient Satisfaction',
        value: '95%',
        description: 'Rating kepuasan pasien'
      },
      {
        label: 'Response Time',
        value: '24/7',
        description: 'Layanan tanpa henti'
      }
    ],
    body: `# Klinik Sehat: AI Assistant 24/7 Patient Care

## Background
Klinik Sehat membutuhkan sistem yang dapat menangani appointment booking dan pertanyaan pasien di luar jam operasional.

## Implementation
- AI assistant untuk appointment booking
- FAQ automation
- Symptom checker basic
- Integration dengan sistem klinik

## Results
Pelayanan pasien menjadi lebih responsif dan efisien dengan tingkat kepuasan 95%.`,
    seo: {
      title: 'Case Study: Klinik Sehat AI Assistant 24/7 Patient Care',
      description: 'Klinik Sehat menggunakan AI assistant untuk menangani appointment booking dan pertanyaan pasien 24/7.',
      keywords: ['case study', 'ai healthcare', 'patient care', 'appointment booking', 'klinik']
    },
    status: 'published'
  },
  {
    id: '4',
    title: 'Gudang Pintar: AI Inventory Optimization -40% Waste',
    slug: 'gudang-pintar-ai-inventory-optimization',
    summary: 'Gudang Pintar menggunakan AI untuk prediksi demand dan optimasi inventory, mengurangi waste 40%.',
    logo: '/images/case-studies/gudang-pintar-logo.png',
    client: 'Gudang Pintar',
    industry: 'Logistics',
    publishedAt: '2024-01-01',
    metrics: [
      {
        label: 'Inventory Waste',
        value: '-40%',
        description: 'Pengurangan waste inventory'
      },
      {
        label: 'Stockout Events',
        value: '-60%',
        description: 'Pengurangan kejadian stockout'
      },
      {
        label: 'Cost Savings',
        value: '+25%',
        description: 'Penghematan biaya operasional'
      }
    ],
    body: `# Gudang Pintar: AI Inventory Optimization

## Problem
Gudang Pintar mengalami masalah overstock dan stockout yang menyebabkan kerugian finansial.

## AI Solution
- Demand forecasting dengan machine learning
- Automated reorder points
- Seasonal trend analysis
- Real-time inventory optimization

## Business Impact
Inventory management menjadi lebih akurat dan efisien dengan penghematan biaya 25%.`,
    seo: {
      title: 'Case Study: Gudang Pintar AI Inventory Optimization',
      description: 'Gudang Pintar menggunakan AI untuk prediksi demand dan optimasi inventory, mengurangi waste 40%.',
      keywords: ['case study', 'ai inventory', 'inventory optimization', 'logistics', 'warehouse']
    },
    status: 'published'
  }
];

// Get case studies using universal storage adapter
export async function readCaseStudiesFromFile(): Promise<CaseStudy[]> {
  const storage = getStorageAdapter();
  return await storage.read('case-studies', defaultCaseStudies);
}

// Save case studies using universal storage adapter
export async function writeCaseStudiesToFile(caseStudies: CaseStudy[]): Promise<void> {
  const storage = getStorageAdapter();
  // Sort by publishedAt (newest first)
  const sortedStudies = caseStudies.sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  await storage.write('case-studies', sortedStudies);
}

// Server-side functions for case study management
export async function getCaseStudiesFromStorage(): Promise<CaseStudy[]> {
  return await readCaseStudiesFromFile();
}

export async function addCaseStudyToStorage(caseStudy: CaseStudy): Promise<void> {
  const caseStudies = await readCaseStudiesFromFile();
  caseStudies.push(caseStudy);
  await writeCaseStudiesToFile(caseStudies);
}

export async function updateCaseStudyInStorage(id: string, updatedCaseStudy: Partial<CaseStudy>): Promise<CaseStudy | null> {
  const caseStudies = await readCaseStudiesFromFile();
  const index = caseStudies.findIndex(cs => cs.id === id);
  if (index === -1) return null;

  caseStudies[index] = { ...caseStudies[index], ...updatedCaseStudy };
  await writeCaseStudiesToFile(caseStudies);
  return caseStudies[index];
}

export async function deleteCaseStudyFromStorage(id: string): Promise<boolean> {
  const caseStudies = await readCaseStudiesFromFile();
  const index = caseStudies.findIndex(cs => cs.id === id);
  if (index === -1) return false;

  caseStudies.splice(index, 1);
  await writeCaseStudiesToFile(caseStudies);
  return true;
}

export async function getCaseStudyByIdFromStorage(id: string): Promise<CaseStudy | undefined> {
  const caseStudies = await readCaseStudiesFromFile();
  return caseStudies.find(cs => cs.id === id);
}

export async function getCaseStudyBySlugFromStorage(slug: string): Promise<CaseStudy | undefined> {
  const caseStudies = await readCaseStudiesFromFile();
  return caseStudies.find(cs => cs.slug === slug);
}