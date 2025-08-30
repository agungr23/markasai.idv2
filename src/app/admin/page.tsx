'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Package,
  Trophy,
  MessageSquare,
  Image,
  Settings,
  Plus,
  TrendingUp,
  Users,
  Calendar
} from 'lucide-react';
import Link from 'next/link';

// Import data untuk statistik real
import { blogPosts } from '@/data/blog';
import { products } from '@/data/products';
import { caseStudies } from '@/data/case-studies';
import { testimonials } from '@/data/testimonials';

export default function AdminDashboard() {
  const [mediaCount, setMediaCount] = useState(0);

  useEffect(() => {
    // Check auth immediately on mount
    const authToken = localStorage.getItem('admin_token');
    if (!authToken || authToken !== 'authenticated') {
      // Force immediate redirect
      window.location.replace('/admin/login');
      return;
    }

    // Load media count
    loadMediaCount();
  }, []);

  const loadMediaCount = async () => {
    try {
      const response = await fetch('/api/media');
      if (response.ok) {
        const data = await response.json();
        setMediaCount(data.files?.length || 0); // Hanya hitung file yang diupload
      }
    } catch (error) {
      console.error('Failed to load media count:', error);
      setMediaCount(0); // Default to 0 files
    }
  };

  // Real statistics from data
  const stats = [
    {
      title: 'Blog Posts',
      count: blogPosts.length,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      href: '/admin/blog'
    },
    {
      title: 'Products',
      count: products.length,
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      href: '/admin/products'
    },
    {
      title: 'Case Studies',
      count: caseStudies.length,
      icon: Trophy,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      href: '/admin/case-studies'
    },
    {
      title: 'Testimonials',
      count: testimonials.length,
      icon: MessageSquare,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      href: '/admin/testimonials'
    },
    {
      title: 'Media Files',
      count: mediaCount,
      icon: Image,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      href: '/admin/media'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Selamat datang di CMS MarkasAI - Kelola konten website dengan mudah
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-green-600 border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            System Online
          </Badge>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link key={index} href={stat.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        {stat.title}
                      </p>
                      <p className={`text-3xl font-bold ${stat.color}`}>
                        {stat.count}
                      </p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/admin/blog/new">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 w-full">
                <FileText className="w-6 h-6 text-blue-600" />
                <div className="text-center">
                  <h3 className="font-semibold">New Blog Post</h3>
                  <p className="text-sm text-gray-600">Create article</p>
                </div>
              </Button>
            </Link>

            <Link href="/admin/products/new">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 w-full">
                <Package className="w-6 h-6 text-green-600" />
                <div className="text-center">
                  <h3 className="font-semibold">Add Product</h3>
                  <p className="text-sm text-gray-600">New AI product</p>
                </div>
              </Button>
            </Link>

            <Link href="/admin/case-studies/new">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 w-full">
                <Trophy className="w-6 h-6 text-purple-600" />
                <div className="text-center">
                  <h3 className="font-semibold">New Case Study</h3>
                  <p className="text-sm text-gray-600">Success story</p>
                </div>
              </Button>
            </Link>

            <Link href="/admin/media">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 w-full">
                <Image className="w-6 h-6 text-pink-600" />
                <div className="text-center">
                  <h3 className="font-semibold">Upload Media</h3>
                  <p className="text-sm text-gray-600">Manage files</p>
                </div>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Recent Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {blogPosts.slice(0, 3).map((post, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{post.title}</p>
                    <p className="text-xs text-gray-600">Blog Post</p>
                  </div>
                  <Badge variant="secondary">Published</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-50">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Website</span>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-200">
                  Online
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-green-50">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">CMS</span>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-200">
                  Active
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium">Media Storage</span>
                </div>
                <Badge variant="outline" className="text-blue-600 border-blue-200">
                  {mediaCount} Files
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
