'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Save, Star, User } from 'lucide-react';
import { useTestimonials } from '@/hooks/useTestimonials';
import Link from 'next/link';

export default function EditTestimonialPage() {
  const router = useRouter();
  const params = useParams();
  const { testimonials, updateTestimonial } = useTestimonials();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    position: '',
    company: '',
    avatar: '',
    content: '',
    rating: 5,
    featured: false,
    status: 'draft' as 'draft' | 'published',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: [] as string[]
  });

  // Load testimonial data
  useEffect(() => {
    if (testimonials.length > 0 && params.id) {
      const testimonial = testimonials.find(t => t.id === params.id);
      if (testimonial) {
        setFormData({
          name: testimonial.name,
          position: testimonial.position,
          company: testimonial.company,
          avatar: testimonial.avatar || '',
          content: testimonial.content,
          rating: testimonial.rating,
          featured: testimonial.featured,
          status: testimonial.status,
          seoTitle: testimonial.seo?.title || '',
          seoDescription: testimonial.seo?.description || '',
          seoKeywords: testimonial.seo?.keywords || []
        });
      } else {
        setNotFound(true);
      }
    }
  }, [testimonials, params.id]);

  const handleSubmit = async (e: React.FormEvent | null, status?: 'draft' | 'published') => {
    if (e) e.preventDefault();
    setIsLoading(true);

    try {
      const finalStatus = status || formData.status;
      await updateTestimonial(params.id as string, {
        ...formData,
        status: finalStatus,
        seo: {
          title: formData.seoTitle || `Testimonial ${formData.name}`,
          description: formData.seoDescription || formData.content.substring(0, 160),
          keywords: formData.seoKeywords
        }
      });
      
      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/testimonials');
      }, 2000);
    } catch (error) {
      console.error('Error updating testimonial:', error);
      alert('Gagal mengupdate testimonial');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStars = (rating: number, interactive = false) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-6 h-6 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
        onClick={interactive ? () => setFormData(prev => ({ ...prev, rating: i + 1 })) : undefined}
      />
    ));
  };

  if (notFound) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/testimonials">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Testimonial Tidak Ditemukan</h1>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-12 text-center">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Testimonial tidak ditemukan
            </h3>
            <p className="text-gray-600 mb-6">
              Testimonial yang Anda cari mungkin sudah dihapus atau tidak ada.
            </p>
            <Button asChild>
              <Link href="/admin/testimonials">
                Kembali ke Daftar Testimonials
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/testimonials">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Testimonial</h1>
            <p className="text-gray-600">Edit testimonial dari {formData.name}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleSubmit(null, 'draft')}
            disabled={isLoading}
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Menyimpan...' : 'Simpan Draft'}
          </Button>
          <Button 
            type="button"
            className="btn-gradient-markasai"
            size="sm"
            onClick={() => handleSubmit(null, 'published')}
            disabled={isLoading}
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Menyimpan...' : 'Update & Publish'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Klien</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Lengkap *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="position">Posisi/Jabatan *</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                    placeholder="CEO"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">Perusahaan *</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  placeholder="PT. Contoh Perusahaan"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="avatar">URL Avatar</Label>
                <Input
                  id="avatar"
                  value={formData.avatar}
                  onChange={(e) => setFormData(prev => ({ ...prev, avatar: e.target.value }))}
                  placeholder="https://example.com/avatar.jpg"
                />
                <p className="text-sm text-gray-500">
                  Opsional. URL gambar profil klien.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Testimonial</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="content">Konten Testimonial *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Tulis testimonial dari klien..."
                  rows={6}
                  required
                />
                <p className="text-sm text-gray-500">
                  {formData.content.length}/500 karakter
                </p>
              </div>
              
              <div className="space-y-2">
                <Label>Rating *</Label>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    {renderStars(formData.rating, true)}
                  </div>
                  <span className="text-sm text-gray-600">({formData.rating}/5)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seoTitle">SEO Title</Label>
                <Input
                  id="seoTitle"
                  value={formData.seoTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, seoTitle: e.target.value }))}
                  placeholder="Auto-generated dari nama klien"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="seoDescription">SEO Description</Label>
                <Textarea
                  id="seoDescription"
                  value={formData.seoDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, seoDescription: e.target.value }))}
                  placeholder="Auto-generated dari konten testimonial"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => 
                    setFormData(prev => ({ ...prev, featured: e.target.checked }))
                  }
                  className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                />
                <Label htmlFor="featured" className="text-sm font-medium">
                  Jadikan Featured Testimonial
                </Label>
              </div>
              <p className="text-xs text-gray-500">
                Testimonial featured akan ditampilkan di halaman utama
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {formData.name || 'Nama Klien'}
                    </p>
                    <p className="text-xs text-gray-600">
                      {formData.position || 'Posisi'} at {formData.company || 'Perusahaan'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  {renderStars(formData.rating)}
                </div>
                
                <p className="text-sm text-gray-700 italic">
                  &quot;{formData.content || 'Konten testimonial akan muncul di sini...'}&quot;
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Success Alert */}
      {success && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">
            ✅ Testimonial berhasil diupdate! Mengalihkan ke halaman admin...
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}