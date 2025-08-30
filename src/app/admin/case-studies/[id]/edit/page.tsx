'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { CaseStudyPreview } from '@/components/case-study-preview';
import { ArrowLeft, Save, Plus, X, Eye } from 'lucide-react';
import { useCaseStudies } from '@/hooks/useCaseStudies';
import Link from 'next/link';

interface Metric {
  label: string;
  value: string;
  description: string;
}

export default function EditCaseStudy() {
  const router = useRouter();
  const params = useParams();
  const { caseStudies, loading, getCaseStudyById, updateCaseStudy } = useCaseStudies();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    client: '',
    industry: '',
    summary: '',
    body: '',
    logo: '',
    publishedAt: '',
    status: 'draft' as 'draft' | 'published',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: [] as string[]
  });
  
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [newMetric, setNewMetric] = useState({ label: '', value: '', description: '' });

  // Load case study data
  useEffect(() => {
    const loadCaseStudy = async () => {
      try {
        const response = await fetch(`/api/case-studies/${params.id}`);
        const result = await response.json();

        if (result.success && result.caseStudy) {
          const caseStudy = result.caseStudy;
          setFormData({
            title: caseStudy.title,
            slug: caseStudy.slug,
            client: caseStudy.client,
            industry: caseStudy.industry,
            summary: caseStudy.summary,
            body: caseStudy.body,
            logo: caseStudy.logo,
            publishedAt: caseStudy.publishedAt,
            status: caseStudy.status || 'draft',
            seoTitle: caseStudy.seo?.title || '',
            seoDescription: caseStudy.seo?.description || '',
            seoKeywords: caseStudy.seo?.keywords || []
          });
          setMetrics(caseStudy.metrics || []);
          setDataLoaded(true);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error('Error loading case study:', error);
        setNotFound(true);
      }
    };

    if (params.id && !dataLoaded) {
      loadCaseStudy();
    }
  }, [params.id, dataLoaded]);

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
      await updateCaseStudy(params.id as string, {
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
      alert('Gagal mengupdate case study: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state
  if (!dataLoaded && !notFound) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/case-studies">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Link>
          </Button>
        </div>

        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2 text-gray-600">Memuat data case study...</span>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/case-studies">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Link>
          </Button>
        </div>

        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">
            Case study tidak ditemukan.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

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
            <h1 className="text-2xl font-bold text-gray-900">Edit Case Study</h1>
            <p className="text-gray-600">Update informasi case study</p>
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
        </div>
      </div>

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

          {/* Metrics */}
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
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => handleSubmit(null, 'draft')}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Simpan Draft
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  className="w-full btn-gradient-markasai"
                  onClick={() => handleSubmit(null, 'published')}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {formData.status === 'published' ? 'Update & Publish' : 'Publish'}
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
            ✅ Case study berhasil diupdate! Mengalihkan ke halaman admin...
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
