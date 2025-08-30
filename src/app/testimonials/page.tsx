import { SectionTitle } from '@/components/ui/section-title';
import { TestimonialsPageClient } from './testimonials-page-client';

export default function TestimonialsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <SectionTitle
          subtitle="Testimoni Klien"
          title="Apa Kata Mereka"
          description="Dengarkan pengalaman klien yang telah merasakan manfaat AI untuk bisnis mereka"
          centered
          className="mb-16"
        />

        <TestimonialsPageClient />
      </div>
    </div>
  );
}
