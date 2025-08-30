'use client';

import { useState, useEffect } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Product } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Package,
  Star,
  Filter,
  Loader2
} from 'lucide-react';

export default function AdminProductsPage() {
  const {
    products,
    loading,
    deleteProduct,
    searchProducts,
    getActiveProducts
  } = useProducts();

  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      try {
        await deleteProduct(id);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Gagal menghapus produk');
      }
    }
  };

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchTerm === '' ||
                         product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.shortDesc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(products.map(p => p.category))].sort();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Produk</h1>
          <p className="text-gray-600">Kelola semua produk AI MarkasAI</p>
        </div>
        <Button asChild className="btn-gradient-markasai">
          <Link href="/admin/products/new">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Produk
          </Link>
        </Button>
      </div>

      {/* Error State */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cari produk..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">Semua Kategori</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2 text-gray-600">Memuat produk...</span>
        </div>
      )}

      {/* Products Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                {/* Product Image */}
                <div className="relative aspect-video rounded-t-lg overflow-hidden bg-gray-100">
                  <Image
                    src={product.heroImage}
                    alt={product.title}
                    fill
                    className="object-contain bg-white"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-white/90">
                      {product.category}
                    </Badge>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                      {product.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mt-1">
                      {product.shortDesc}
                    </p>
                  </div>

                  {/* Features Count */}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{product.features.length} fitur</span>
                    <span>{product.benefits.length} benefit</span>
                    <span>{product.priceTiers.length} paket</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link href={`/products/${product.slug}`} target="_blank">
                        <Eye className="w-4 h-4 mr-1" />
                        Lihat
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link href={`/admin/products/edit/${product.id}`}>
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredProducts.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Tidak ada produk ditemukan
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedCategory ? 'Coba ubah filter pencarian' : 'Mulai dengan menambahkan produk pertama'}
            </p>
            {!searchTerm && !selectedCategory && (
              <Button asChild className="btn-gradient-markasai">
                <Link href="/admin/products/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Produk
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
