// src/components/admin/LiquorManager.tsx
'use client';

import { useState } from 'react';
import { Product } from './types';

// --- NEW ---
// Define the options for the dropdowns as constants for easy management.
const departmentOptions = ['Spirits', 'Beer and Cider', 'Beverages Juices & Cordials'];
const categoryOptions = ['Spirits', 'Beer', 'Ciders', 'Soft Drinks'];

export default function LiquorManager({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isSaving, setIsSaving] = useState(false);

  // --- NEW GENERIC HANDLER ---
  // This single function handles changes for any field on a product.
  const handleProductChange = (productName: string, field: keyof Product, value: string) => {
    setProducts(currentProducts =>
      currentProducts.map(p =>
        p.name === productName ? { ...p, [field]: value } : p
      )
    );
  };

  const handleDeleteProduct = (productNameToDelete: string) => {
    setProducts(currentProducts =>
      currentProducts.filter(p => p.name !== productNameToDelete)
    );
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/liquor/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(products),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      alert('Changes saved successfully!');
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('Failed to save changes.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={handleSaveChanges}
          disabled={isSaving}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* --- MODIFIED LAYOUT --- */}
      {/* Display products in a simple grid instead of grouping them. 
          This provides a better editing experience. */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(product => (
          <div key={product.name} className="border rounded-lg p-4 flex flex-col justify-between">
            <div>
              <img src={product.image_url} alt={product.name} className="w-full h-48 object-contain mb-2" />
              <p className="font-bold">{product.name}</p>
              <p className="mb-2">{product.price}</p>
              
              {/* --- NEW EDITABLE DROPDOWNS --- */}
              <div className="space-y-2 text-sm">
                <div>
                  <label className="font-semibold block">Department</label>
                  <select
                    value={product.department}
                    onChange={(e) => handleProductChange(product.name, 'department', e.target.value)}
                    className="w-full p-1 border rounded"
                  >
                    {departmentOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-semibold block">Category</label>
                  <select
                    value={product.category}
                    onChange={(e) => handleProductChange(product.name, 'category', e.target.value)}
                    className="w-full p-1 border rounded"
                  >
                    {categoryOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex space-x-2 mt-4">
              
              <button
                onClick={() => handleDeleteProduct(product.name)}
                className="w-full bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}