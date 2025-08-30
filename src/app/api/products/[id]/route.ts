import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Product } from '@/types';

const PRODUCTS_FILE = path.join(process.cwd(), 'public/data/products.json');

// Helper function to read products from JSON file
async function readProductsFromFile(): Promise<Product[]> {
  try {
    const fileContent = await fs.readFile(PRODUCTS_FILE, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    return [];
  }
}

// Helper function to write products to JSON file
async function writeProductsToFile(products: Product[]): Promise<void> {
  await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2));
}

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const products = await readProductsFromFile();

    const product = products.find(p => p.id === id);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error reading product:', error);
    return NextResponse.json({ error: 'Failed to read product' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const updates = await request.json();

    // Read existing products
    const products = await readProductsFromFile();

    // Find and update product
    const existingIndex = products.findIndex(p => p.id === id);
    if (existingIndex >= 0) {
      products[existingIndex] = { ...products[existingIndex], ...updates };
    } else {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Write back to file
    await writeProductsToFile(products);

    // Return updated product
    const updatedProduct = products.find(p => p.id === id);

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Read existing products
    const products = await readProductsFromFile();

    // Remove product from array
    const filteredProducts = products.filter(p => p.id !== id);
    await writeProductsToFile(filteredProducts);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
