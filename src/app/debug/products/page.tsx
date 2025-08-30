'use client';

import { useProducts } from '@/hooks/useProducts';
import { useEffect, useState } from 'react';

export default function DebugProductsPage() {
  const { products, loading, getProductBySlug } = useProducts();
  const [jsonFileData, setJsonFileData] = useState<string>('');

  useEffect(() => {
    // Get JSON file data
    fetch('/data/products.json')
      .then(res => res.json())
      .then(data => setJsonFileData(JSON.stringify(data, null, 2)))
      .catch(err => setJsonFileData('Error loading JSON file: ' + err.message));
  }, []);

  const testSlug = (slug: string) => {
    const product = getProductBySlug(slug);
    console.log(`Testing slug "${slug}":`, product);
    return product;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Products</h1>
      
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">Products in Memory ({products.length})</h2>
          <div className="bg-gray-100 p-4 rounded">
            <pre className="text-sm overflow-auto">
              {JSON.stringify(products.map(p => ({
                id: p.id,
                title: p.title,
                slug: p.slug,
                isActive: p.isActive
              })), null, 2)}
            </pre>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">JSON File Data</h2>
          <div className="bg-gray-100 p-4 rounded">
            <pre className="text-sm overflow-auto">
              {jsonFileData}
            </pre>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Test Slug Lookup</h2>
          <div className="space-y-2">
            {products.map(product => (
              <div key={product.id} className="flex items-center space-x-4">
                <span className="font-mono bg-gray-200 px-2 py-1 rounded">
                  {product.slug}
                </span>
                <button 
                  onClick={() => testSlug(product.slug)}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                >
                  Test
                </button>
                <a 
                  href={`/products/${product.slug}`}
                  target="_blank"
                  className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                >
                  Visit Page
                </a>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Manual Test</h2>
          <div className="flex space-x-2">
            <input 
              type="text" 
              placeholder="Enter slug to test"
              className="border px-3 py-2 rounded"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const slug = (e.target as HTMLInputElement).value;
                  testSlug(slug);
                }
              }}
            />
            <span className="text-sm text-gray-600 self-center">Press Enter to test</span>
          </div>
        </div>
      </div>
    </div>
  );
}
