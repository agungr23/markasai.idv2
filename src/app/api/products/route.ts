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
    console.log('No products file found, creating empty array');
    return [];
  }
}

// Helper function to write products to JSON file
async function writeProductsToFile(products: Product[]): Promise<void> {
  await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2));
}

export async function GET() {
  try {
    const products = await readProductsFromFile();
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error reading products:', error);
    return NextResponse.json({ error: 'Failed to read products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const productData = await request.json();

    // Generate ID
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
    };

    // Read existing products
    const products = await readProductsFromFile();

    // Add new product
    products.push(newProduct);

    // Write back to file
    await writeProductsToFile(products);

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
