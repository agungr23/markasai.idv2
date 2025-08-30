import { SectionTitle } from '@/components/ui/section-title';
import { TestimonialsClient } from './testimonials-client';

export function Testimonials() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          subtitle="TESTIMONI KLIEN"
          title="Apa Kata Mereka"
          description="Dengarkan pengalaman klien yang telah merasakan manfaat AI untuk bisnis mereka"
          centered
          className="mb-12"
        />

        <TestimonialsClient />
      </div>
    </section>
  );
}
