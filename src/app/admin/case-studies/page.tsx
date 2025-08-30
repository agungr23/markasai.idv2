'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCaseStudies } from '@/hooks/useCaseStudies';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Users,
  TrendingUp,
  Filter
} from 'lucide-react';

export default function AdminCaseStudiesPage() {
  const { caseStudies, loading, deleteCaseStudy } = useCaseStudies();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCaseStudies = caseStudies.filter(caseStudy => {
    const matchesSearch = caseStudy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         caseStudy.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         caseStudy.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus case study "${title}"?`)) {
      try {
        await deleteCaseStudy(id);
        alert('Case study berhasil dihapus!');
      } catch (error) {
        alert('Gagal menghapus case study: ' + (error instanceof Error ? error.message : 'Unknown error'));
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Case Studies</h1>
          <p className="text-gray-600">Kelola success stories klien MarkasAI</p>
        </div>
        <Button asChild className="btn-gradient-markasai">
          <Link href="/admin/case-studies/new">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Case Study
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
                  placeholder="Cari case studies..."
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2 text-gray-600">Memuat case studies...</span>
        </div>
      )}

      {/* Case Studies List */}
      {!loading && (
        <div className="grid gap-6">
          {filteredCaseStudies.map((caseStudy) => (
          <Card key={caseStudy.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex gap-6">
                {/* Thumbnail */}
                <div className="relative w-32 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  {caseStudy.logo ? (
                    <Image
                      src={caseStudy.logo}
                      alt={caseStudy.title}
                      fill
                      className="object-cover"
                      sizes="128px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="text-xs">No Logo</span>
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                        {caseStudy.title}
                      </h3>
                      <p className="text-primary font-medium text-sm">
                        {caseStudy.client}
                      </p>
                      <p className="text-gray-600 text-sm line-clamp-2 mt-1">
                        {caseStudy.summary}
                      </p>
                    </div>
                    <Badge variant={caseStudy.status === 'published' ? 'default' : 'secondary'}>
                      {caseStudy.status === 'published' ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                  
                  {/* Metrics */}
                  <div className="flex items-center gap-4 text-sm">
                    {caseStudy.metrics.map((metric, index) => (
                      <div key={index} className="flex items-center gap-1 text-green-600">
                        <TrendingUp className="w-4 h-4" />
                        <span className="font-medium">{metric.label}: {metric.value}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Industry */}
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">
                      {caseStudy.industry}
                    </Badge>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/case-studies/${caseStudy.slug}`} target="_blank">
                        <Eye className="w-4 h-4 mr-1" />
                        Lihat
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/case-studies/${caseStudy.id}/edit`}>
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDelete(caseStudy.id, caseStudy.title)}
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
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredCaseStudies.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Tidak ada case studies ditemukan
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'Coba ubah kata kunci pencarian' : 'Mulai dengan menambahkan case study pertama'}
            </p>
            <Button asChild className="btn-gradient-markasai">
              <Link href="/admin/case-studies/new">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Case Study
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}