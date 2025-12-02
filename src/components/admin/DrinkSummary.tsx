'use client';

import { Guest } from './types';
import { getDrinkById, DRINK_CATEGORIES } from '@/data/drink-options';

interface DrinkSummaryProps {
  guests: Guest[];
}

export default function DrinkSummary({ guests }: DrinkSummaryProps) {
  // 1. Bereken totale tellings vir elke drankie ID
  const drinkCounts: Record<string, number> = {};
  let totalSelections = 0;

  guests.forEach(guest => {
    if (guest.is_attending && guest.drink_preferences) {
      guest.drink_preferences.forEach(drinkId => {
        drinkCounts[drinkId] = (drinkCounts[drinkId] || 0) + 1;
        totalSelections++;
      });
    }
  });

  return (
    <div className="space-y-8">
      {/* Totaal Kaart */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-sm font-medium text-gray-500 uppercase">Totale Drankies Gekies</h3>
        <p className="mt-2 text-3xl font-bold text-[#3d251e]">{totalSelections}</p>
        <p className="text-xs text-gray-400 mt-1">Gebaseer op bywonende gaste se keuses</p>
      </div>

      {/* Loop deur elke kategorie en wys 'n tabel as daar stemme is */}
      {DRINK_CATEGORIES.map((category) => {
        // Kry alle drankies wat in hierdie kategorie val EN wat ten minste 1 stem het
        const categoryDrinks = Object.keys(drinkCounts)
          .map(id => {
            const drink = getDrinkById(id);
            return drink ? { ...drink, count: drinkCounts[id] } : null;
          })
          .filter(d => d !== null && d.category === category.id)
          .sort((a, b) => b!.count - a!.count); // Sorteer hoogste na laagste

        // As geen drankies in hierdie kategorie gekies is nie, moenie die tabel wys nie
        if (categoryDrinks.length === 0) return null;

        // Bereken totaal vir hierdie spesifieke kategorie
        const categoryTotal = categoryDrinks.reduce((sum, item) => sum + (item?.count || 0), 0);

        return (
          <div key={category.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-bold text-[#3d251e]">{category.name}</h2>
              <span className="bg-[#3d251e] text-white text-xs px-2 py-1 rounded-full">
                {categoryTotal} items
              </span>
            </div>
            
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aantal</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categoryDrinks.map((drink, index) => (
                  <tr key={drink!.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-400">
                      #{index + 1}
                    </td>
                    <td className="px-6 py-3 text-sm font-medium text-gray-900">
                      {drink!.name}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm font-bold text-[#3d251e] text-right">
                      {drink!.count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}

      {totalSelections === 0 && (
        <div className="text-center text-gray-500 py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          Geen drankvoorkeure is nog aangedui nie.
        </div>
      )}
    </div>
  );
}