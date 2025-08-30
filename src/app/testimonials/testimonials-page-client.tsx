'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { usePublishedTestimonials } from '@/hooks/usePublishedTestimonials';
import { Star, Search, User } from 'lucide-react';
import Image from 'next/image';

export function TestimonialsPageClient() {
  const { testimonials, loading } = usePublishedTestimonials();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTestimonials = testimonials.filter(testimonial =>
    testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    testimonial.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    testimonial.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      {/* Search */}
      <div className="max-w-md mx-auto mb-12">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Cari testimonial berdasarkan nama atau perusahaan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTestimonials.map((testimonial) => (
          <Card key={testimonial.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-8 space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-muted">
                    {testimonial.avatar ? (
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                        <User className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.position} • {testimonial.company}
                    </div>
                  </div>
                </div>
                
                {testimonial.featured && (
                  <Badge variant="default" className="bg-yellow-100 text-yellow-800">
                    Featured
                  </Badge>
                )}
              </div>
              
              {/* Rating */}
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  {renderStars(testimonial.rating)}
                </div>
                <span className="text-sm text-gray-600">({testimonial.rating}/5)</span>
              </div>
              
              {/* Content */}
              <blockquote className="text-muted-foreground leading-relaxed">
                &ldquo;{testimonial.content}&rdquo;
              </blockquote>
              
              {/* Date */}
              <div className="text-xs text-gray-500 pt-4 border-t">
                {new Date(testimonial.createdAt).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredTestimonials.length === 0 && !loading && (
        <div className="text-center py-12">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchTerm ? 'Tidak ada testimonial yang ditemukan' : 'Belum ada testimonial'}
          </h3>
          <p className="text-gray-600">
            {searchTerm 
              ? 'Coba ubah kata kunci pencarian Anda'
              : 'Testimonial dari klien akan muncul di sini'
            }
          </p>
        </div>
      )}
    </>
  );
}
