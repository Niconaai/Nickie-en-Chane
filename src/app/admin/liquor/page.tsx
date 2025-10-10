// src/app/admin/liquor/page.tsx
import { promises as fs } from 'fs';
import path from 'path';
import Link from 'next/link';
import LiquorManager from '@/components/admin/LiquorManager';
import { Product } from '@/components/admin/types';

// This is a Next.js Server Component. It runs on the server and is ideal for fetching data.
// We are fetching the data here and passing it to the client component LiquorManager.
export default async function LiquorAdminPage() {
  // Find the path to the JSON file in the project's root directory
  const jsonDirectory = path.join(process.cwd(), '');
  // Read the JSON file
  const fileContents = await fs.readFile(jsonDirectory + '/checkers_products_selenium.json', 'utf8');
  // Parse the JSON file into an array of Product objects
  const products: Product[] = JSON.parse(fileContents);

  return (
    <div className="container text-gray-900 mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Liquor Products</h1>
      {/* This Link component from Next.js provides client-side navigation
            back to the main admin dashboard without a full page reload. */}
      <Link
        href="/admin"
        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
      >
        &larr; Back to Dashboard
      </Link>
      <LiquorManager initialProducts={products} />
    </div>
  );
}