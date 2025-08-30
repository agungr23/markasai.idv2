import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Produk AI untuk Bisnis - MarkasAI',
  description: 'Jelajahi koleksi lengkap produk AI MarkasAI untuk mengoptimalkan bisnis Anda. Dari video creator hingga customer support otomatis.',
  keywords: ['produk ai', 'solusi bisnis', 'ai tools', 'marketing ai', 'customer service ai'],
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
