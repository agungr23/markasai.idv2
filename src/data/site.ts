import { ValuePillar, Testimonial, NavItem } from '@/types';

export const valuePillars: ValuePillar[] = [
  {
    title: 'Newbie Friendly',
    description: 'Interface sederhana dan mudah dipakai, bahkan untuk pemula yang baru mengenal AI.',
    icon: 'UserCheck'
  },
  {
    title: 'Tutorial & Support',
    description: 'Tutorial lengkap dan tim support responsif siap membantu Anda 24/7.',
    icon: 'BookOpen'
  },
  {
    title: 'Komunitas',
    description: 'Bergabung dengan komunitas pengguna untuk belajar dan berbagi strategi AI.',
    icon: 'Users'
  },
  {
    title: 'Up To Date',
    description: 'Fitur dan informasi AI selalu diperbarui mengikuti perkembangan teknologi terbaru.',
    icon: 'Zap'
  }
];

// Import testimonials from the main data file to keep them in sync
export { getFeaturedTestimonials as testimonials } from '@/data/testimonials';

export const navigationItems: NavItem[] = [
  {
    title: 'Solusi',
    href: '/products',
    description: 'Jelajahi semua produk AI kami',
    items: [
      {
        title: 'VIDABOT',
        href: '/products/vidabot',
        description: 'AI Video Creator untuk promosi & afiliasi'
      },
      {
        title: 'AI Business Assistant',
        href: '/products/ai-business-assistant',
        description: 'Asisten AI untuk operasional bisnis'
      },
      {
        title: 'AI Copy & Marketing',
        href: '/products/ai-copy-marketing',
        description: 'Generator copy marketing yang converting'
      },
      {
        title: 'AI Customer Support',
        href: '/products/ai-customer-support',
        description: 'Layanan pelanggan otomatis 24/7'
      }
    ]
  },
  {
    title: 'Sumber Daya',
    href: '/resources',
    items: [
      {
        title: 'Blog',
        href: '/blog',
        description: 'Artikel dan tips seputar AI untuk bisnis'
      },
      {
        title: 'Case Studies',
        href: '/case-studies',
        description: 'Studi kasus sukses klien kami'
      },
      {
        title: 'Testimonials',
        href: '/testimonials',
        description: 'Testimoni dan review dari klien kami'
      }
    ]
  },
  {
    title: 'Perusahaan',
    href: '/about',
    items: [
      {
        title: 'Tentang Kami',
        href: '/about',
        description: 'Profil dan visi misi MarkasAI'
      }
    ]
  },
  {
    title: 'Pricing',
    href: '/pricing'
  },
  {
    title: 'Contact',
    href: '/contact'
  }
];

export const siteConfig = {
  name: 'MarkasAI.ID',
  description: 'Software house & platform AI untuk bisnis yang membantu UMKM, entrepreneur, dan perusahaan meningkatkan efektivitas & efisiensi kerja.',
  url: 'https://markasai.id',
  ogImage: '/images/og-image.jpg',
  links: {
    twitter: 'https://twitter.com/markasai',
    instagram: 'https://instagram.com/markasai.id',
    linkedin: 'https://linkedin.com/company/markasai',
    youtube: 'https://youtube.com/@markasai'
  }
};