'use client';

import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/types';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Load products from API
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };



  // Get product by ID
  const getProductById = useCallback((id: string): Product | undefined => {
    return products.find(p => p.id === id);
  }, [products]);

  // Get product by slug
  const getProductBySlug = useCallback((slug: string): Product | undefined => {
    return products.find(p => p.slug === slug);
  }, [products]);

  // Add new product
  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        throw new Error('Failed to create product');
      }

      const newProduct = await response.json();

      // Refresh products list
      await fetchProducts();

      return newProduct;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  };

  // Update existing product
  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      // Refresh products list
      await fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  // Delete product
  const deleteProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      // Refresh products list
      await fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  };

  // Get active products only
  const getActiveProducts = () => {
    return products.filter(product => product.isActive !== false);
  };



  // Search products
  const searchProducts = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return products.filter(product =>
      product.title.toLowerCase().includes(lowercaseQuery) ||
      product.shortDesc.toLowerCase().includes(lowercaseQuery) ||
      product.category.toLowerCase().includes(lowercaseQuery)
    );
  };

  return {
    products,
    loading,
    getProductById,
    getProductBySlug,
    addProduct,
    updateProduct,
    deleteProduct,
    getActiveProducts,
    searchProducts,
    fetchProducts,
  };
}


