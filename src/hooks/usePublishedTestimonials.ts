'use client';

import { useState, useEffect } from 'react';
import { Testimonial } from '@/types';

export function usePublishedTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/testimonials/published');
      const result = await response.json();
      
      if (result.success) {
        setTestimonials(result.testimonials);
      }
    } catch (error) {
      console.error('Error fetching published testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  return {
    testimonials,
    loading,
    refreshTestimonials: fetchTestimonials
  };
}
