'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BlogPost } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  Filter,
  FileText
} from 'lucide-react';

export default function AdminBlogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch posts from API
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/blog');
      const data = await response.json();

      if (data.success) {
        setPosts(data.posts);
        setError(null);
      } else {
        setError('Failed to fetch posts');
      }
    } catch (err) {
      setError('Error loading posts');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (postId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus post ini?')) {
      try {
        const response = await fetch(`/api/blog?id=${postId}`, {
          method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
          // Refresh posts list
          await fetchPosts();
          alert('Post berhasil dihapus!');
        } else {
          alert('Gagal menghapus post: ' + result.error);
        }
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Gagal menghapus post!');
      }
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-gray-600">Kelola semua artikel blog MarkasAI</p>
        </div>
        <Button asChild className="btn-gradient-markasai">
          <Link href="/admin/blog/new">
            <Plus className="w-4 h-4 mr-2" />
            Tulis Post Baru
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cari blog posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading posts...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchPosts}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Posts List */}
      {!loading && !error && (
        <div className="grid gap-6">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex gap-6">
                {/* Thumbnail */}
                <div className="relative w-40 h-32 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border">
                  <Image
                    src={post.cover}
                    alt={post.title}
                    fill
                    className="object-contain bg-white"
                    sizes="160px"
                  />
                </div>
                
                {/* Content */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2 mt-1">
                        {post.excerpt}
                      </p>
                    </div>
                    <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                      {post.status === 'published' ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                  
                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{post.author.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(post.publishedAt).toLocaleDateString('id-ID')}</span>
                    </div>
                  </div>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {post.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{post.tags.length - 3} lagi
                      </Badge>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/blog/${post.slug}`} target="_blank">
                        <Eye className="w-4 h-4 mr-1" />
                        Lihat
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/blog/edit/${post.id}`}>
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDelete(post.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Hapus
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Tidak ada blog posts ditemukan
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'Coba ubah kata kunci pencarian' : 'Mulai dengan membuat blog post pertama'}
              </p>
              <Button asChild className="btn-gradient-markasai">
                <Link href="/admin/blog/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Tulis Post Baru
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      )}
    </div>
  );
}
