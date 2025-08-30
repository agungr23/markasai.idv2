// Product Types
export interface Product {
  id: string;
  title: string;
  slug: string;
  shortDesc: string;
  description: string;
  features: string[];
  benefits: string[];
  heroImage: string;
  gallery: string[];
  category: string;
  priceTiers: PriceTier[];
  faq: FAQ[];
  seo: SEO;
  isActive?: boolean;
  isFeatured?: boolean;
}

export interface PriceTier {
  name: string;
  price: number;
  period: 'monthly' | 'yearly';
  features: string[];
  popular?: boolean;
}

export interface FAQ {
  question: string;
  answer: string;
}

// Blog Types
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover: string;
  body: string;
  publishedAt: string;
  author: Author;
  tags: string[];
  status: 'draft' | 'published';
  seo: SEO;
  readTime: number;
}

export interface Author {
  name: string;
  avatar: string;
  bio: string;
}

// Case Study Types
export interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  summary: string;
  logo: string;
  metrics: Metric[];
  body: string;
  client: string;
  industry: string;
  publishedAt: string;
  status: 'draft' | 'published';
  seo: SEO;
}

export interface Metric {
  label: string;
  value: string;
  description: string;
}

// Testimonial Types
export interface Testimonial {
  id: string;
  name: string;
  position: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
  featured: boolean;
  status: 'draft' | 'published';
  createdAt: string;
  seo: SEO;
}

// SEO Types
export interface SEO {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
}

// Form Types
export interface LeadFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  source?: string;
}

// Navigation Types
export interface NavItem {
  title: string;
  href: string;
  description?: string;
  items?: NavItem[];
}

// Value Pillar Types
export interface ValuePillar {
  title: string;
  description: string;
  icon: string;
}

// Media Types
export interface MediaFile {
  id: string;
  name: string;
  originalName: string;
  url: string;
  type: 'image' | 'video' | 'file';
  size: string;
  uploadedAt: string;
  dimensions: string;
  deletable: boolean;
  isStatic: boolean;
}


