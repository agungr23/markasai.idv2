export interface Testimonial {
  id: string;
  name: string;
  position: string;
  company: string;
  content: string;
  rating: number;
  image?: string;
  featured: boolean;
  createdAt: string;
}

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Budi Santoso',
    position: 'CEO',
    company: 'TechStart Indonesia',
    content: 'MarkasAI telah mengubah cara kami berinteraksi dengan pelanggan. Chatbot AI mereka sangat responsif dan membantu meningkatkan kepuasan pelanggan hingga 40%.',
    rating: 5,
    image: '/images/testimonials/budi.jpg',
    featured: true,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Sari Dewi',
    position: 'Marketing Director',
    company: 'Digital Solutions',
    content: 'Implementasi AI chatbot dari MarkasAI sangat mudah dan hasilnya luar biasa. Tim support mereka juga sangat membantu selama proses implementasi.',
    rating: 5,
    image: '/images/testimonials/sari.jpg',
    featured: true,
    createdAt: '2024-01-20'
  },
  {
    id: '3',
    name: 'Ahmad Rahman',
    position: 'Operations Manager',
    company: 'E-Commerce Plus',
    content: 'Dengan MarkasAI, kami bisa menangani 10x lebih banyak inquiry pelanggan tanpa menambah staff. ROI yang sangat menguntungkan!',
    rating: 5,
    image: '/images/testimonials/ahmad.jpg',
    featured: false,
    createdAt: '2024-02-01'
  },
  {
    id: '4',
    name: 'Lisa Wijaya',
    position: 'Customer Service Head',
    company: 'Retail Modern',
    content: 'Chatbot AI MarkasAI memahami bahasa Indonesia dengan sangat baik. Pelanggan kami merasa seperti berbicara dengan manusia sungguhan.',
    rating: 4,
    image: '/images/testimonials/lisa.jpg',
    featured: false,
    createdAt: '2024-02-10'
  },
  {
    id: '5',
    name: 'Rudi Hartono',
    position: 'IT Director',
    company: 'Bank Digital',
    content: 'Keamanan dan reliabilitas sistem MarkasAI sangat baik. Cocok untuk industri perbankan yang membutuhkan standar keamanan tinggi.',
    rating: 5,
    image: '/images/testimonials/rudi.jpg',
    featured: true,
    createdAt: '2024-02-15'
  },
  {
    id: '6',
    name: 'Maya Sari',
    position: 'Founder',
    company: 'Startup Hub',
    content: 'Sebagai startup, kami membutuhkan solusi yang cost-effective. MarkasAI memberikan value yang luar biasa dengan harga yang terjangkau.',
    rating: 4,
    image: '/images/testimonials/maya.jpg',
    featured: false,
    createdAt: '2024-02-20'
  },
  {
    id: '7',
    name: 'Doni Prasetyo',
    position: 'Sales Manager',
    company: 'Property Group',
    content: 'Lead generation meningkat 60% setelah menggunakan chatbot MarkasAI. Prospek yang masuk juga lebih berkualitas.',
    rating: 5,
    image: '/images/testimonials/doni.jpg',
    featured: false,
    createdAt: '2024-03-01'
  },
  {
    id: '8',
    name: 'Rina Kusuma',
    position: 'Product Manager',
    company: 'SaaS Indonesia',
    content: 'Integrasi dengan sistem existing kami berjalan sangat smooth. Tim teknis MarkasAI sangat kompeten dan responsif.',
    rating: 5,
    image: '/images/testimonials/rina.jpg',
    featured: false,
    createdAt: '2024-03-05'
  },
  {
    id: '9',
    name: 'Agus Setiawan',
    position: 'Business Owner',
    company: 'UMKM Digital',
    content: 'Sebagai UMKM, kami sangat terbantu dengan adanya chatbot AI. Sekarang bisa melayani pelanggan 24/7 tanpa perlu hire staff tambahan.',
    rating: 4,
    image: '/images/testimonials/agus.jpg',
    featured: false,
    createdAt: '2024-03-10'
  },
  {
    id: '10',
    name: 'Dewi Lestari',
    position: 'Marketing Head',
    company: 'Fashion Brand',
    content: 'Conversion rate dari website meningkat signifikan setelah pasang chatbot MarkasAI. Pelanggan jadi lebih engage dan mudah untuk purchase.',
    rating: 5,
    image: '/images/testimonials/dewi.jpg',
    featured: true,
    createdAt: '2024-03-15'
  },
  {
    id: '11',
    name: 'Hendra Wijaya',
    position: 'COO',
    company: 'Logistics Corp',
    content: 'Tracking dan customer support jadi jauh lebih efisien dengan MarkasAI. Komplain pelanggan turun drastis.',
    rating: 4,
    image: '/images/testimonials/hendra.jpg',
    featured: false,
    createdAt: '2024-03-20'
  },
  {
    id: '12',
    name: 'Indira Sari',
    position: 'Digital Marketing',
    company: 'Agency Creative',
    content: 'Kami recommend MarkasAI ke semua klien kami. Hasilnya selalu memuaskan dan ROI yang jelas terukur.',
    rating: 5,
    image: '/images/testimonials/indira.jpg',
    featured: false,
    createdAt: '2024-03-25'
  },
  {
    id: '13',
    name: 'Joko Susilo',
    position: 'General Manager',
    company: 'Hotel Chain',
    content: 'Guest satisfaction meningkat berkat chatbot MarkasAI yang bisa handle booking dan inquiry 24/7. Sangat membantu operasional hotel.',
    rating: 5,
    image: '/images/testimonials/joko.jpg',
    featured: false,
    createdAt: '2024-04-01'
  },
  {
    id: '14',
    name: 'Kartika Putri',
    position: 'Owner',
    company: 'Beauty Clinic',
    content: 'Appointment booking jadi lebih mudah dan otomatis. Pasien juga senang karena bisa konsultasi awal melalui chatbot.',
    rating: 4,
    image: '/images/testimonials/kartika.jpg',
    featured: false,
    createdAt: '2024-04-05'
  },
  {
    id: '15',
    name: 'Lukman Hakim',
    position: 'Tech Lead',
    company: 'Fintech Startup',
    content: 'API integration sangat mudah dan dokumentasi lengkap. Developer experience yang sangat baik dari MarkasAI.',
    rating: 5,
    image: '/images/testimonials/lukman.jpg',
    featured: true,
    createdAt: '2024-04-10'
  }
];

// Helper functions
export const getFeaturedTestimonials = () => {
  return testimonials.filter(testimonial => testimonial.featured);
};

export const getTestimonialById = (id: string) => {
  return testimonials.find(testimonial => testimonial.id === id);
};

export const getTestimonialsByRating = (minRating: number) => {
  return testimonials.filter(testimonial => testimonial.rating >= minRating);
};
