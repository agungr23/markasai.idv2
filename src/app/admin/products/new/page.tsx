'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProducts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Product, PriceTier, FAQ } from '@/types';
import { ArrowLeft, Save, Eye, Plus, X, Trash2 } from 'lucide-react';
import Link from 'next/link';
import ProductPreviewModal from '@/components/admin/ProductPreviewModal';

export default function NewProduct() {
  const router = useRouter();
  const { addProduct } = useProducts();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    shortDesc: '',
    description: '',
    category: '',
    heroImage: '',
    gallery: [] as string[],
    features: [] as string[],
    benefits: [] as string[],
    priceTiers: [] as PriceTier[],
    faq: [] as FAQ[],
    isActive: true,
    seo: {
      title: '',
      description: '',
      keywords: [] as string[],
      ogImage: ''
    }
  });

  const [newFeature, setNewFeature] = useState('');
  const [newBenefit, setNewBenefit] = useState('');
  const [newGalleryImage, setNewGalleryImage] = useState('');
  const [newKeyword, setNewKeyword] = useState('');

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
      slug: generateSlug(title),
      seo: {
        ...prev.seo,
        title: title || prev.seo.title
      }
    }));
  };

  const handleShortDescChange = (shortDesc: string) => {
    setFormData(prev => ({
      ...prev,
      shortDesc,
      seo: {
        ...prev.seo,
        description: shortDesc || prev.seo.description
      }
    }));
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const addBenefit = () => {
    if (newBenefit.trim()) {
      setFormData(prev => ({
        ...prev,
        benefits: [...prev.benefits, newBenefit.trim()]
      }));
      setNewBenefit('');
    }
  };

  const removeBenefit = (index: number) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }));
  };

  const addGalleryImage = () => {
    if (newGalleryImage.trim()) {
      setFormData(prev => ({
        ...prev,
        gallery: [...prev.gallery, newGalleryImage.trim()]
      }));
      setNewGalleryImage('');
    }
  };

  const removeGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
    }));
  };

  const addKeyword = () => {
    if (newKeyword.trim()) {
      setFormData(prev => ({
        ...prev,
        seo: {
          ...prev.seo,
          keywords: [...prev.seo.keywords, newKeyword.trim()]
        }
      }));
      setNewKeyword('');
    }
  };

  const removeKeyword = (index: number) => {
    setFormData(prev => ({
      ...prev,
      seo: {
        ...prev.seo,
        keywords: prev.seo.keywords.filter((_, i) => i !== index)
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Add product using hook
      const newProduct = await addProduct(formData);
      console.log('Product created:', newProduct);

      setSuccess(true);

      // Redirect after success
      setTimeout(() => {
        router.push('/admin/products');
      }, 2000);
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Gagal menyimpan produk: ' + (error instanceof Error ? error.message : 'Unknown error'));
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
            <Link href="/admin/products">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tambah Produk Baru</h1>
            <p className="text-gray-600">Buat produk AI baru untuk MarkasAI</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(true)}
            disabled={!formData.title || !formData.description}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button
            form="product-form"
            type="submit"
            className="btn-gradient-markasai"
            disabled={isLoading}
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </div>
      </div>

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">
            Produk berhasil disimpan! Mengalihkan ke daftar produk...
          </AlertDescription>
        </Alert>
      )}

      <form id="product-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Dasar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Nama Produk</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Contoh: VIDABOT"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="slug">Slug URL</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="vidabot"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="shortDesc">Deskripsi Singkat</Label>
                <Textarea
                  id="shortDesc"
                  value={formData.shortDesc}
                  onChange={(e) => handleShortDescChange(e.target.value)}
                  placeholder="Deskripsi singkat produk (maks 200 karakter)"
                  maxLength={200}
                  required
                />
                <p className="text-xs text-gray-500">{formData.shortDesc.length}/200 karakter</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi Lengkap</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Deskripsi lengkap produk"
                  className="min-h-[200px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Kategori</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="Contoh: Video & Content"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Gambar Produk</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="heroImage">Hero Image URL</Label>
                <Input
                  id="heroImage"
                  value={formData.heroImage}
                  onChange={(e) => setFormData(prev => ({ ...prev, heroImage: e.target.value }))}
                  placeholder="/images/products/product-hero.jpg"
                />
              </div>
              {formData.heroImage && (
                <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100 border">
                  <img
                    src={formData.heroImage}
                    alt="Hero Preview"
                    className="w-full h-full object-contain bg-white"
                    onError={(e) => {
                      e.currentTarget.src = '/images/dummy-placeholder.svg';
                    }}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Gallery Images</Label>
                <div className="flex gap-2">
                  <Input
                    value={newGalleryImage}
                    onChange={(e) => setNewGalleryImage(e.target.value)}
                    placeholder="URL gambar gallery"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGalleryImage())}
                  />
                  <Button type="button" onClick={addGalleryImage} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {formData.gallery.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {formData.gallery.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="relative h-24 rounded border overflow-hidden bg-gray-100">
                          <img
                            src={image}
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-full object-contain bg-white"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeGalleryImage(index)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>Fitur Produk</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Tambah fitur baru"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                />
                <Button type="button" onClick={addFeature} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm">{feature}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFeature(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card>
            <CardHeader>
              <CardTitle>Manfaat Produk</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newBenefit}
                  onChange={(e) => setNewBenefit(e.target.value)}
                  placeholder="Tambah manfaat baru"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
                />
                <Button type="button" onClick={addBenefit} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-2">
                {formData.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm">{benefit}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeBenefit(index)}
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
          {/* Product Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Produk</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Kategori</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">Pilih kategori</option>
                  <option value="Video AI">Video AI</option>
                  <option value="Business AI">Business AI</option>
                  <option value="Marketing AI">Marketing AI</option>
                  <option value="Customer Support">Customer Support</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Hero Image */}
          <Card>
            <CardHeader>
              <CardTitle>Hero Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="heroImage">URL Gambar</Label>
                <Input
                  id="heroImage"
                  value={formData.heroImage}
                  onChange={(e) => setFormData(prev => ({ ...prev, heroImage: e.target.value }))}
                  placeholder="/images/products/example.jpg"
                />
              </div>
              {formData.heroImage && (
                <div className="relative w-full h-32 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={formData.heroImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/images/dummy-placeholder.svg';
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* SEO */}
          <Card>
            <CardHeader>
              <CardTitle>SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seoTitle">SEO Title</Label>
                <Input
                  id="seoTitle"
                  value={formData.seo.title}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    seo: { ...prev.seo, title: e.target.value }
                  }))}
                  placeholder="Auto-generated dari title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seoDescription">SEO Description</Label>
                <Textarea
                  id="seoDescription"
                  value={formData.seo.description}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    seo: { ...prev.seo, description: e.target.value }
                  }))}
                  placeholder="Auto-generated dari deskripsi singkat"
                  maxLength={160}
                />
                <p className="text-xs text-gray-500">{formData.seo.description.length}/160 karakter</p>
              </div>

              <div className="space-y-2">
                <Label>Keywords</Label>
                <div className="flex gap-2">
                  <Input
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    placeholder="Tambah keyword"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                  />
                  <Button type="button" onClick={addKeyword} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {formData.seo.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {formData.seo.keywords.map((keyword, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {keyword}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="ml-1 h-auto p-0 text-gray-500 hover:text-red-600"
                          onClick={() => removeKeyword(index)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pricing Tiers */}
          <Card>
            <CardHeader>
              <CardTitle>Paket Harga</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.priceTiers.map((tier, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <Input
                      value={tier.name}
                      onChange={(e) => {
                        const newTiers = [...formData.priceTiers];
                        newTiers[index].name = e.target.value;
                        setFormData(prev => ({ ...prev, priceTiers: newTiers }));
                      }}
                      placeholder="Nama paket"
                      className="font-medium"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newTiers = formData.priceTiers.filter((_, i) => i !== index);
                        setFormData(prev => ({ ...prev, priceTiers: newTiers }));
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      value={tier.price}
                      onChange={(e) => {
                        const newTiers = [...formData.priceTiers];
                        newTiers[index].price = parseInt(e.target.value) || 0;
                        setFormData(prev => ({ ...prev, priceTiers: newTiers }));
                      }}
                      placeholder="Harga"
                    />
                    <select
                      value={tier.period}
                      onChange={(e) => {
                        const newTiers = [...formData.priceTiers];
                        newTiers[index].period = e.target.value as 'monthly' | 'yearly';
                        setFormData(prev => ({ ...prev, priceTiers: newTiers }));
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="monthly">Per Bulan</option>
                      <option value="yearly">Per Tahun</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Fitur Paket:</Label>
                    {tier.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex gap-2">
                        <Input
                          value={feature}
                          onChange={(e) => {
                            const newTiers = [...formData.priceTiers];
                            newTiers[index].features[featureIndex] = e.target.value;
                            setFormData(prev => ({ ...prev, priceTiers: newTiers }));
                          }}
                          placeholder="Fitur paket"
                          className="text-sm"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newTiers = [...formData.priceTiers];
                            newTiers[index].features = newTiers[index].features.filter((_, i) => i !== featureIndex);
                            setFormData(prev => ({ ...prev, priceTiers: newTiers }));
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newTiers = [...formData.priceTiers];
                        newTiers[index].features.push('');
                        setFormData(prev => ({ ...prev, priceTiers: newTiers }));
                      }}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Fitur
                    </Button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={tier.popular || false}
                      onChange={(e) => {
                        const newTiers = [...formData.priceTiers];
                        newTiers[index].popular = e.target.checked;
                        setFormData(prev => ({ ...prev, priceTiers: newTiers }));
                      }}
                      className="rounded"
                    />
                    <Label className="text-sm">Paket Populer</Label>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const newTier: PriceTier = {
                    name: '',
                    price: 0,
                    period: 'monthly',
                    features: ['']
                  };
                  setFormData(prev => ({ ...prev, priceTiers: [...prev.priceTiers, newTier] }));
                }}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Paket Harga
              </Button>
            </CardContent>
          </Card>

          {/* FAQ */}
          <Card>
            <CardHeader>
              <CardTitle>FAQ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.faq.map((faqItem, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 space-y-2">
                      <Input
                        value={faqItem.question}
                        onChange={(e) => {
                          const newFaq = [...formData.faq];
                          newFaq[index].question = e.target.value;
                          setFormData(prev => ({ ...prev, faq: newFaq }));
                        }}
                        placeholder="Pertanyaan"
                      />
                      <Textarea
                        value={faqItem.answer}
                        onChange={(e) => {
                          const newFaq = [...formData.faq];
                          newFaq[index].answer = e.target.value;
                          setFormData(prev => ({ ...prev, faq: newFaq }));
                        }}
                        placeholder="Jawaban"
                        className="min-h-[80px]"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newFaq = formData.faq.filter((_, i) => i !== index);
                        setFormData(prev => ({ ...prev, faq: newFaq }));
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const newFaqItem: FAQ = {
                    question: '',
                    answer: ''
                  };
                  setFormData(prev => ({ ...prev, faq: [...prev.faq, newFaqItem] }));
                }}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah FAQ
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>

      {/* Preview Modal */}
      <ProductPreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        productData={formData}
      />
    </div>
  );
}
