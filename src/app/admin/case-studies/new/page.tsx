'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { CaseStudyPreview } from '@/components/case-study-preview';
import { ArrowLeft, Save, Eye, Plus, X, TrendingUp } from 'lucide-react';
import { useCaseStudies } from '@/hooks/useCaseStudies';
import Link from 'next/link';

interface Metric {
  label: string;
  value: string;
  description: string;
}

export default function NewCaseStudy() {
  const router = useRouter();
  const { addCaseStudy } = useCaseStudies();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    client: '',
    industry: '',
    summary: '',
    body: '',
    logo: '',
    publishedAt: new Date().toISOString().split('T')[0],
    status: 'draft' as 'draft' | 'published',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: [] as string[]
  });

  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [newMetric, setNewMetric] = useState({ label: '', value: '', description: '' });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  const addMetric = () => {
    if (newMetric.label.trim() && newMetric.value.trim() && newMetric.description.trim()) {
      setMetrics(prev => [...prev, { ...newMetric }]);
      setNewMetric({ label: '', value: '', description: '' });
    }
  };

  const removeMetric = (index: number) => {
    setMetrics(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent | null, status?: 'draft' | 'published') => {
    if (e) e.preventDefault();
    setIsLoading(true);

    try {
      const finalStatus = status || formData.status;
      await addCaseStudy({
        ...formData,
        status: finalStatus,
        metrics,
        seo: {
          title: formData.seoTitle || formData.title,
          description: formData.seoDescription || formData.summary,
          keywords: formData.seoKeywords
        }
      });

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/case-studies');
      }, 2000);
    } catch (error) {
      alert('Gagal menyimpan case study: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/case-studies">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tambah Case Study Baru</h1>
            <p className="text-gray-600">Dokumentasikan success story klien baru</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(true)}
            disabled={!formData.title || !formData.body}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
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
            {isLoading ? 'Menyimpan...' : 'Publish'}
          </Button>
        </div>
      </div>

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">
            Case study berhasil disimpan! Mengalihkan ke daftar case studies...
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Dasar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Judul Case Study</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Contoh: TokoBudi Meningkatkan Penjualan 300% dengan AI"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="slug">Slug URL</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="tokobudi-success-story"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client">Nama Klien</Label>
                  <Input
                    id="client"
                    value={formData.client}
                    onChange={(e) => setFormData(prev => ({ ...prev, client: e.target.value }))}
                    placeholder="TokoBudi.com"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="industry">Industri</Label>
                  <Input
                    id="industry"
                    value={formData.industry}
                    onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                    placeholder="E-commerce"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="logo">Logo URL</Label>
                <Input
                  id="logo"
                  value={formData.logo}
                  onChange={(e) => setFormData(prev => ({ ...prev, logo: e.target.value }))}
                  placeholder="/images/case-studies/client-logo.png"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary">Summary</Label>
                <Textarea
                  id="summary"
                  value={formData.summary}
                  onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                  placeholder="Ringkasan singkat case study..."
                  className="min-h-[80px]"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="body">Konten Lengkap</Label>
                <RichTextEditor
                  value={formData.body}
                  onChange={(value) => setFormData(prev => ({ ...prev, body: value }))}
                  placeholder="Tulis case study lengkap di sini..."
                  rows={20}
                />
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <Card>
            <CardHeader>
              <CardTitle>Hasil & Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Input
                  value={newMetric.label}
                  onChange={(e) => setNewMetric(prev => ({ ...prev, label: e.target.value }))}
                  placeholder="Label: Peningkatan Penjualan"
                />
                <Input
                  value={newMetric.value}
                  onChange={(e) => setNewMetric(prev => ({ ...prev, value: e.target.value }))}
                  placeholder="Value: 300%"
                />
                <div className="flex gap-2">
                  <Input
                    value={newMetric.description}
                    onChange={(e) => setNewMetric(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Deskripsi: Dalam 6 bulan"
                  />
                  <Button type="button" onClick={addMetric} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                {metrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <div>
                        <span className="text-sm font-medium">{metric.label}: </span>
                        <span className="text-sm text-green-600 font-bold">{metric.value}</span>
                        <p className="text-xs text-gray-500">{metric.description}</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMetric(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* SEO Settings */}
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
                  placeholder="Otomatis dari judul jika kosong"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seoDescription">SEO Description</Label>
                <Textarea
                  id="seoDescription"
                  value={formData.seoDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, seoDescription: e.target.value }))}
                  placeholder="Otomatis dari summary jika kosong"
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seoKeywords">SEO Keywords (pisahkan dengan koma)</Label>
                <Input
                  id="seoKeywords"
                  value={formData.seoKeywords.join(', ')}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    seoKeywords: e.target.value.split(',').map(k => k.trim()).filter(k => k)
                  }))}
                  placeholder="case study, ai, success story"
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                <Button
                  type="submit"
                  className="w-full btn-gradient-markasai"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Simpan Case Study
                    </>
                  )}
                </Button>

                <Button type="button" variant="outline" className="w-full" asChild>
                  <Link href="/admin/case-studies">
                    Batal
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Success Alert */}
      {success && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">
            ✅ Case study berhasil disimpan! Mengalihkan ke halaman admin...
          </AlertDescription>
        </Alert>
      )}

      {/* Preview Modal */}
      {showPreview && (
        <CaseStudyPreview
          formData={formData}
          metrics={metrics}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}