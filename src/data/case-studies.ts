export interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  summary: string;
  logo: string;
  client: string;
  industry: string;
  publishedAt: string;
  metrics: {
    label: string;
    value: string;
    description: string;
  }[];
  body: string;
}

export const caseStudies: CaseStudy[] = [
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

Setelah 6 bulan implementasi, TokoBudi.com berhasil mencapai:
- 300% peningkatan penjualan
- 95% customer satisfaction rate
- 2 menit response time (dari 2 jam)
- 50% pengurangan operational cost`
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

## Challenge
PT Maju Jaya kesulitan mengelola campaign marketing yang efektif dengan tim yang terbatas.

## Solution
- AI-powered email marketing
- Automated social media posting
- Predictive analytics untuk targeting
- Personalized content generation

## Impact
Campaign marketing menjadi lebih efisien dan efektif dengan ROI yang meningkat drastis.`
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
Pelayanan pasien menjadi lebih responsif dan efisien dengan tingkat kepuasan 95%.`
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
Inventory management menjadi lebih akurat dan efisien dengan penghematan biaya 25%.`
  }
];

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find(caseStudy => caseStudy.slug === slug);
}

export function getCaseStudyById(id: string): CaseStudy | undefined {
  return caseStudies.find(caseStudy => caseStudy.id === id);
}
