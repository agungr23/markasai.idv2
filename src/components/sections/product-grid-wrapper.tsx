'use client';

import { ProductGrid } from './product-grid';

interface ProductGridWrapperProps {
  title?: string;
  subtitle?: string;
  description?: string;
  showAll?: boolean;
  limit?: number;
}

export function ProductGridWrapper(props: ProductGridWrapperProps) {
  return <ProductGrid {...props} />;
}
