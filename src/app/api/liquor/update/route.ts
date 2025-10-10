// src/app/api/liquor/update/route.ts
import { promises as fs } from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { Product } from '@/components/admin/types';

// This function handles POST requests to /api/liquor/update.
// It's a Route Handler, a core feature of Next.js for creating API endpoints.
export async function POST(request: NextRequest) {
  try {
    // 1. Parse the incoming request body to get the updated products.
    const products: Product[] = await request.json();

    // 2. Define the path to the JSON file. It's crucial this path is correct.
    const filePath = path.join(process.cwd(), 'checkers_products_selenium.json');

    // 3. Convert the product array back into a nicely formatted JSON string.
    // The 'null, 2' argument formats the JSON with an indent of 2 spaces for readability.
    const updatedData = JSON.stringify(products, null, 2);

    // 4. Write the updated JSON string back to the file, overwriting the previous content.
    await fs.writeFile(filePath, updatedData, 'utf8');

    // 5. Return a success response.
    return NextResponse.json({ message: 'Products updated successfully' }, { status: 200 });
  } catch (error) {
    // 6. If any error occurs during the process, log it and return an error response.
    console.error('Failed to update products:', error);
    return NextResponse.json({ message: 'Failed to update products', error: (error as Error).message }, { status: 500 });
  }
}