'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useTestimonials } from '@/hooks/useTestimonials';
import { Plus, Search, Edit, Trash2, Star, User, Building } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminTestimonialsPage() {
  const { testimonials, loading, deleteTestimonial } = useTestimonials();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const filteredTestimonials = testimonials.filter(testimonial =>
    testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    testimonial.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    testimonial.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus testimonial dari ${name}?`)) {
      return;
    }

    setDeleteLoading(id);
    try {
      await deleteTestimonial(id);
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      alert('Gagal menghapus testimonial');
    } finally {
      setDeleteLoading(null);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <span className="ml-4 text-lg text-gray-600">Memuat testimonials...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Testimonials</h1>
          <p className="text-gray-600">Kelola testimonial dan review dari klien</p>
        </div>
        
        <Button asChild className="btn-gradient-markasai">
          <Link href="/admin/testimonials/new">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Testimonial
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold">{testimonials.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Star className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Published</p>
                <p className="text-2xl font-bold">
                  {testimonials.filter(t => t.status === 'published').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="w-5 h-5 text-yellow-600 fill-current" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Featured</p>
                <p className="text-2xl font-bold">
                  {testimonials.filter(t => t.featured).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Building className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold">
                  {testimonials.length > 0
                    ? (testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length).toFixed(1)
                    : '0.0'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Cari testimonial berdasarkan nama, perusahaan, atau konten..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Testimonials List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTestimonials.map((testimonial) => (
          <Card key={testimonial.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative w-12 h-12 bg-gray-100 rounded-full overflow-hidden">
                    {testimonial.avatar ? (
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <User className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                    <p className="text-sm text-gray-600">{testimonial.position}</p>
                    <p className="text-sm text-gray-500">{testimonial.company}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {testimonial.featured && (
                    <Badge variant="default" className="bg-yellow-100 text-yellow-800">
                      Featured
                    </Badge>
                  )}
                  <Badge variant={testimonial.status === 'published' ? 'default' : 'secondary'}>
                    {testimonial.status === 'published' ? 'Published' : 'Draft'}
                  </Badge>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  {renderStars(testimonial.rating)}
                </div>
                <span className="text-sm text-gray-600">({testimonial.rating}/5)</span>
              </div>

              {/* Content */}
              <p className="text-gray-700 line-clamp-3">
                &quot;{testimonial.content}&quot;
              </p>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-xs text-gray-500">
                  {new Date(testimonial.createdAt).toLocaleDateString('id-ID')}
                </div>

                <div className="flex items-center space-x-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/testimonials/${testimonial.id}/edit`}>
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Link>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(testimonial.id, testimonial.name)}
                    disabled={deleteLoading === testimonial.id}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    {deleteLoading === testimonial.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-1"></div>
                    ) : (
                      <Trash2 className="w-4 h-4 mr-1" />
                    )}
                    Hapus
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredTestimonials.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm ? 'Tidak ada testimonial yang ditemukan' : 'Belum ada testimonial'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? 'Coba ubah kata kunci pencarian Anda'
                : 'Mulai tambahkan testimonial pertama dari klien Anda'
              }
            </p>
            {!searchTerm && (
              <Button asChild className="btn-gradient-markasai">
                <Link href="/admin/testimonials/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Testimonial
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}