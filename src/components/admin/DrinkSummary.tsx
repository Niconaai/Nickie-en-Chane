'use client';

import { Guest } from './types';
import { getDrinkById, DRINK_CATEGORIES } from '@/data/drink-options';

interface DrinkSummaryProps {
  guests: Guest[];
}

export default function DrinkSummary({ guests }: DrinkSummaryProps) {
  // Bereken totale
  const drinkCounts: Record<string, number> = {};
  let totalSelections = 0;

  guests.forEach(guest => {
    // Tel slegs as gas bywoon
    if (guest.is_attending && guest.drink_preferences) {
      guest.drink_preferences.forEach(drinkId => {
        drinkCounts[drinkId] = (drinkCounts[drinkId] || 0) + 1;
        totalSelections++;
      });
    }
  });

  // Sorteer drankies volgens gewildheid (hoogste na laagste)
  const sortedDrinkIds = Object.keys(drinkCounts).sort((a, b) => drinkCounts[b] - drinkCounts[a]);

  return (
    <div className="space-y-6">
      {/* Totaal Kaart */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Totale Drankies Gekies</h3>
          <p className="mt-2 text-3xl font-bold text-[#3d251e]">{totalSelections}</p>
          <p className="text-xs text-gray-400 mt-1">Gebaseer op bywonende gaste se keuses</p>
        </div>
      </div>

      {/* Gedetailleerde Lys */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Gewildste Drankies</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Drankie Naam</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategorie</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aantal Stemme</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% van Totaal</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedDrinkIds.map((drinkId, index) => {
                const count = drinkCounts[drinkId];
                const drinkInfo = getDrinkById(drinkId);
                const percentage = totalSelections > 0 ? ((count / totalSelections) * 100).toFixed(1) : '0';
                
                // Vind die leesbare kategorie naam
                // drinkInfo.category mag dalk 'n string wees wat nie direk match nie, so ons soek veilig
                const categoryName = drinkInfo 
                  ? (DRINK_CATEGORIES.find(c => c.id === drinkInfo.category)?.name || drinkInfo.category)
                  : 'Onbekend';

                return (
                  <tr key={drinkId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      #{index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {drinkInfo?.name || drinkId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {categoryName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#3d251e]">
                      {count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {percentage}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {sortedDrinkIds.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            Geen drankvoorkeure is nog aangedui nie.
          </div>
        )}
      </div>
    </div>
  );
}