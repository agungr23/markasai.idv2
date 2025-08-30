import { Metadata } from 'next';
import { products as staticProducts } from '@/data/products';

interface ProductLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductLayoutProps): Promise<Metadata> {
  const { slug } = await params;
  const product = staticProducts.find(p => p.slug === slug);

  if (!product) {
    return {
      title: 'Produk Tidak Ditemukan - MarkasAI',
      description: 'Produk yang Anda cari tidak ditemukan.',
    };
  }

  return {
    title: product.seo?.title || `${product.title} - MarkasAI`,
    description: product.seo?.description || product.shortDesc,
    keywords: product.seo?.keywords || [],
    openGraph: {
      title: product.seo?.title || product.title,
      description: product.seo?.description || product.shortDesc,
      images: product.seo?.ogImage ? [product.seo.ogImage] : product.heroImage ? [product.heroImage] : [],
    },
  };
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return children;
}
