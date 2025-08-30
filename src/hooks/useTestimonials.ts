'use client';

import { useState, useEffect } from 'react';
import { Testimonial } from '@/types';

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/testimonials');
      const result = await response.json();
      
      if (result.success) {
        setTestimonials(result.testimonials);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const addTestimonial = async (testimonialData: Omit<Testimonial, 'id' | 'createdAt'>) => {
    try {
      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testimonialData),
      });

      const result = await response.json();
      
      if (result.success) {
        await fetchTestimonials(); // Refresh the list
        return result;
      } else {
        throw new Error(result.error || 'Failed to add testimonial');
      }
    } catch (error) {
      console.error('Error adding testimonial:', error);
      throw error;
    }
  };

  const updateTestimonial = async (id: string, testimonialData: Omit<Testimonial, 'id' | 'createdAt'>) => {
    try {
      const response = await fetch(`/api/testimonials/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testimonialData),
      });

      const result = await response.json();
      
      if (result.success) {
        await fetchTestimonials(); // Refresh the list
        return result;
      } else {
        throw new Error(result.error || 'Failed to update testimonial');
      }
    } catch (error) {
      console.error('Error updating testimonial:', error);
      throw error;
    }
  };

  const deleteTestimonial = async (id: string) => {
    try {
      const response = await fetch(`/api/testimonials/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      
      if (result.success) {
        await fetchTestimonials(); // Refresh the list
        return result;
      } else {
        throw new Error(result.error || 'Failed to delete testimonial');
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      throw error;
    }
  };

  return {
    testimonials,
    loading,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    refreshTestimonials: fetchTestimonials
  };
}
