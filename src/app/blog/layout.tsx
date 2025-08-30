import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog - Tips & Insights AI untuk Bisnis | MarkasAI',
  description: 'Baca artikel terbaru tentang AI, tips bisnis, dan insights dari para ahli MarkasAI untuk mengoptimalkan bisnis Anda.',
  keywords: ['blog ai', 'tips bisnis', 'artificial intelligence', 'marketing digital', 'teknologi'],
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
