import { Testimonial } from '@/types';
import { getStorageAdapter } from './storage-adapter';

export async function getTestimonialsFromStorage(): Promise<Testimonial[]> {
  const storage = getStorageAdapter();
  return await storage.read('testimonials', []);
}

export async function getTestimonialByIdFromStorage(id: string): Promise<Testimonial | null> {
  const testimonials = await getTestimonialsFromStorage();
  return testimonials.find(testimonial => testimonial.id === id) || null;
}

export async function saveTestimonialToStorage(testimonial: Testimonial): Promise<void> {
  const storage = getStorageAdapter();
  const testimonials = await getTestimonialsFromStorage();
  
  // Check if testimonial already exists
  const existingIndex = testimonials.findIndex(t => t.id === testimonial.id);
  
  if (existingIndex >= 0) {
    // Update existing testimonial
    testimonials[existingIndex] = testimonial;
  } else {
    // Add new testimonial
    testimonials.push(testimonial);
  }
  
  // Sort by createdAt (newest first)
  testimonials.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  await storage.write('testimonials', testimonials);
}

export async function deleteTestimonialFromStorage(id: string): Promise<void> {
  const storage = getStorageAdapter();
  const testimonials = await getTestimonialsFromStorage();
  const filteredTestimonials = testimonials.filter(testimonial => testimonial.id !== id);
  
  await storage.write('testimonials', filteredTestimonials);
}

export async function getPublishedTestimonialsFromStorage(): Promise<Testimonial[]> {
  const testimonials = await getTestimonialsFromStorage();
  return testimonials.filter(testimonial => testimonial.status === 'published');
}

export async function getFeaturedTestimonialsFromStorage(): Promise<Testimonial[]> {
  const testimonials = await getPublishedTestimonialsFromStorage();
  return testimonials.filter(testimonial => testimonial.featured);
}
