'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import Image from 'next/image';
import { usePublishedTestimonials } from '@/hooks/usePublishedTestimonials';

export function TestimonialsClient() {
  const { testimonials, loading } = usePublishedTestimonials();
  
  // Filter only featured testimonials for homepage (already published from API)
  const featuredTestimonials = testimonials
    .filter(t => t.featured)
    .slice(0, 6); // Limit to 6 testimonials

  if (loading) {
    return (
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If no testimonials, don't show anything
  if (featuredTestimonials.length === 0) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredTestimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
            {/* Rating */}
            <div className="flex space-x-1 mb-4">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'
                  }`}
                />
              ))}
            </div>

            {/* Content */}
            <blockquote className="text-gray-700 text-sm leading-relaxed mb-6 font-normal">
              &ldquo;{testimonial.content}&rdquo;
            </blockquote>

            {/* Author */}
            <div className="flex items-center space-x-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                {testimonial.avatar ? (
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600 bg-gray-100">
                    <span className="text-base font-semibold">
                      {testimonial.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-gray-900 text-sm">
                  {testimonial.name}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {testimonial.position} • {testimonial.company}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
