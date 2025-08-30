import { Testimonial } from '@/types';
import fs from 'fs';
import path from 'path';

const TESTIMONIALS_FILE = path.join(process.cwd(), 'data', 'testimonials.json');

// Ensure data directory exists
const dataDir = path.dirname(TESTIMONIALS_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize with empty array if file doesn't exist
if (!fs.existsSync(TESTIMONIALS_FILE)) {
  fs.writeFileSync(TESTIMONIALS_FILE, JSON.stringify([], null, 2));
}

export async function getTestimonialsFromStorage(): Promise<Testimonial[]> {
  try {
    const data = fs.readFileSync(TESTIMONIALS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading testimonials:', error);
    return [];
  }
}

export async function getTestimonialByIdFromStorage(id: string): Promise<Testimonial | null> {
  try {
    const testimonials = await getTestimonialsFromStorage();
    return testimonials.find(testimonial => testimonial.id === id) || null;
  } catch (error) {
    console.error('Error getting testimonial by id:', error);
    return null;
  }
}

export async function saveTestimonialToStorage(testimonial: Testimonial): Promise<void> {
  try {
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
    
    fs.writeFileSync(TESTIMONIALS_FILE, JSON.stringify(testimonials, null, 2));
  } catch (error) {
    console.error('Error saving testimonial:', error);
    throw error;
  }
}

export async function deleteTestimonialFromStorage(id: string): Promise<void> {
  try {
    const testimonials = await getTestimonialsFromStorage();
    const filteredTestimonials = testimonials.filter(testimonial => testimonial.id !== id);
    
    fs.writeFileSync(TESTIMONIALS_FILE, JSON.stringify(filteredTestimonials, null, 2));
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    throw error;
  }
}

export async function getPublishedTestimonialsFromStorage(): Promise<Testimonial[]> {
  try {
    const testimonials = await getTestimonialsFromStorage();
    return testimonials.filter(testimonial => testimonial.status === 'published');
  } catch (error) {
    console.error('Error getting published testimonials:', error);
    return [];
  }
}

export async function getFeaturedTestimonialsFromStorage(): Promise<Testimonial[]> {
  try {
    const testimonials = await getPublishedTestimonialsFromStorage();
    return testimonials.filter(testimonial => testimonial.featured);
  } catch (error) {
    console.error('Error getting featured testimonials:', error);
    return [];
  }
}
