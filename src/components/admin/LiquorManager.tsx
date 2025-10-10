// src/components/admin/LiquorManager.tsx
'use client';

import { useState } from 'react';
import { Product } from './types';

export default function LiquorManager({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isSaving, setIsSaving] = useState(false);

  const handleToggleActive = (productName: string) => {
    setProducts(currentProducts =>
      currentProducts.map(p =>
        p.name === productName ? { ...p, active: p.active === 'yes' ? 'no' : 'yes' } : p
      )
    );
  };

  // --- NEW FUNCTION ---
  // This function handles the deletion of a product.
  const handleDeleteProduct = (productNameToDelete: string) => {
    // We use window.confirm to prevent accidental deletions.
    
      // If confirmed, we filter the products array to remove the selected product.
      // This updates the component's state, and React re-renders the UI.
      setProducts(currentProducts =>
        currentProducts.filter(p => p.name !== productNameToDelete))
      
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/liquor/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // The current `products` state (which may have fewer items after a delete)
        // is sent to the API to be saved.
        body: JSON.stringify(products),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result.message);
      alert('Changes saved successfully!');
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('Failed to save changes. Check the console for more details.');
    } finally {
      setIsSaving(false);
    }
  };

  const groupedProducts = products.reduce((acc, product) => {
    const { department, category } = product;
    if (!acc[department]) {
      acc[department] = {};
    }
    if (!acc[department][category]) {
      acc[department][category] = [];
    }
    acc[department][category].push(product);
    return acc;
  }, {} as Record<string, Record<string, Product[]>>);

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

      {Object.entries(groupedProducts).map(([department, categories]) => (
        <div key={department} className="mb-8">
          <h2 className="text-xl font-semibold mb-4 capitalize">{department}</h2>
          {Object.entries(categories).map(([category, items]) => (
            <div key={category} className="mb-6">
              <h3 className="text-lg font-medium mb-3 capitalize">{category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map(product => (
                  <div key={product.name} className="border rounded-lg p-4 flex flex-col justify-between">
                    <div>
                      <img src={product.image_url} alt={product.name} className="w-full h-48 object-contain mb-2" />
                      <p className="font-bold">{product.name}</p>
                      <p>{product.price}</p>
                    </div>
                    {/* --- NEW BUTTON AND WRAPPER --- */}
                    <div className="flex space-x-2 mt-2">
                      
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
          ))}
        </div>
      ))}
    </div>
  );
}