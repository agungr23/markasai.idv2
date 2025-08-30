'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { BlogPost } from '@/types';
import { ArrowLeft, Save, Eye, Plus, X, Trash2, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function EditBlogPost() {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    tags: [] as string[],
    cover: '',
    author: '',
    status: 'draft'
  });
  
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    // Load existing blog post data from API
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/blog?id=${params.id}`);
        const data = await response.json();

        if (data.success && data.posts.length > 0) {
          const post = data.posts.find((p: BlogPost) => p.id === params.id);
          if (post) {
            setFormData({
              title: post.title,
              slug: post.slug,
              excerpt: post.excerpt,
              content: post.body,
              tags: post.tags,
              cover: post.cover,
              author: post.author.name,
              status: post.status || 'draft'
            });
          } else {
            setNotFound(true);
          }
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        setNotFound(true);
      }
    };

    fetchPost();
  }, [params.id]);

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

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/blog', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: params.id,
          title: formData.title,
          slug: formData.slug,
          excerpt: formData.excerpt,
          content: formData.content,
          tags: formData.tags,
          cover: formData.cover,
          author: formData.author,
          status: formData.status
        })
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        // Redirect after 2 seconds
        setTimeout(() => {
          router.push('/admin/blog');
        }, 2000);
      } else {
        alert('Gagal mengupdate post: ' + result.error);
      }
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Gagal mengupdate post!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Apakah Anda yakin ingin menghapus blog post ini?')) {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Deleted blog post:', params.id);
      router.push('/admin/blog');
    }
  };

  if (notFound) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertDescription>
            Blog post tidak ditemukan.
          </AlertDescription>
        </Alert>
        <Button asChild variant="outline">
          <Link href="/admin/blog">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Blog
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Blog Post</h1>
            <p className="text-gray-600">Edit artikel blog MarkasAI</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(true)}
            disabled={!formData.title || !formData.content}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleDelete}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Hapus
          </Button>
          <Button 
            form="blog-form" 
            type="submit" 
            className="btn-gradient-markasai"
            disabled={isLoading}
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Menyimpan...' : 'Update'}
          </Button>
        </div>
      </div>

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">
            Blog post berhasil diupdate! Mengalihkan ke daftar blog...
          </AlertDescription>
        </Alert>
      )}

      <form id="blog-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Konten Utama</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Judul</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Masukkan judul blog post"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="slug">Slug URL</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="url-friendly-slug"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Ringkasan singkat artikel (maks 200 karakter)"
                  className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  maxLength={200}
                  required
                />
                <p className="text-xs text-gray-500">{formData.excerpt.length}/200 karakter</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Konten</Label>
                <RichTextEditor
                  value={formData.content}
                  onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                  placeholder="Tulis konten blog post di sini..."
                  rows={20}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Publish</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Featured Image */}
          <Card>
            <CardHeader>
              <CardTitle>Featured Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cover">URL Gambar</Label>
                <Input
                  id="cover"
                  value={formData.cover}
                  onChange={(e) => setFormData(prev => ({ ...prev, cover: e.target.value }))}
                  placeholder="/images/blog/example.jpg"
                />
              </div>
              {formData.cover && (
                <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100 border">
                  <img
                    src={formData.cover}
                    alt="Preview"
                    className="w-full h-full object-contain bg-white"
                    onError={(e) => {
                      e.currentTarget.src = '/images/dummy-placeholder.svg';
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Tambah tag"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </form>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Preview Blog Post</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Blog Post Preview - Styled like actual blog */}
              <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
                <div className="container mx-auto px-6 py-12">
                  <div className="max-w-4xl mx-auto">
                    {/* Header Section */}
                    <div className="text-center mb-12">
                      {formData.tags.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-2 mb-6">
                          {formData.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                        {formData.title || 'Untitled Post'}
                      </h1>

                      {formData.excerpt && (
                        <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto">
                          {formData.excerpt}
                        </p>
                      )}

                      <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {formData.author.charAt(0).toUpperCase()}
                          </div>
                          <span>{formData.author}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date().toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}</span>
                        </div>
                      </div>
                    </div>

                    {/* Featured Image */}
                    {formData.cover && (
                      <div className="relative aspect-video rounded-2xl overflow-hidden mb-12 bg-gray-100">
                        <img
                          src={formData.cover}
                          alt={formData.title}
                          className="w-full h-full object-contain bg-white"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="bg-white">
                <div className="container mx-auto px-6 py-12">
                  <div className="max-w-4xl mx-auto">
                    <div className="prose prose-lg max-w-none">
                      {formData.content ? (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: (() => {
                              let html = formData.content;

                              // Convert headers (must be done first)
                              html = html.replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold mt-8 mb-4 text-gray-900">$1</h3>');
                              html = html.replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mt-10 mb-6 text-gray-900">$1</h2>');
                              html = html.replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mt-12 mb-8 text-gray-900">$1</h1>');

                              // Convert bold and italic
                              html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');
                              html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');

                              // Convert lists
                              html = html.replace(/^- (.*$)/gm, '<div class="flex items-start mb-2"><span class="mr-2 text-primary">•</span><span>$1</span></div>');

                              // Split into paragraphs and process
                              const paragraphs = html.split('\n\n');
                              html = paragraphs.map(p => {
                                p = p.trim();
                                if (!p) return '';
                                // Don't wrap headers or list items in paragraphs
                                if (p.startsWith('<h') || p.startsWith('<div class="flex')) {
                                  return p;
                                }
                                // Replace single line breaks with <br> within paragraphs
                                p = p.replace(/\n/g, '<br>');
                                return `<p class="mb-4 text-gray-700 leading-relaxed">${p}</p>`;
                              }).join('\n');

                              return html;
                            })()
                          }}
                        />
                      ) : (
                        <p className="text-gray-500 italic">No content yet...</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-2 p-4 border-t bg-gray-50">
              <Button
                variant="outline"
                onClick={() => setShowPreview(false)}
              >
                Close Preview
              </Button>
              <Button
                onClick={() => {
                  setShowPreview(false);
                  // Focus on form
                  document.getElementById('blog-form')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-gradient-markasai"
              >
                Continue Editing
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
