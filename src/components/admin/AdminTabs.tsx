'use client';

interface AdminTabsProps {
  activeTab: 'families' | 'guests';
  onTabChange: (tab: 'families' | 'guests') => void;
  familiesCount: number;
  guestsCount: number;
}

export default function AdminTabs({
  activeTab,
  onTabChange,
  familiesCount,
  guestsCount
}: AdminTabsProps) {
  return (
    <div className="flex space-x-4 mb-6">
      <button
        onClick={() => onTabChange('families')}
        className={`px-4 py-2 rounded-lg ${
          activeTab === 'families' 
            ? 'bg-gray-800 text-white' 
            : 'bg-white text-gray-900 border border-gray-300'
        }`}
      >
        Families ({familiesCount})
      </button>
      <button
        onClick={() => onTabChange('guests')}
        className={`px-4 py-2 rounded-lg ${
          activeTab === 'guests' 
            ? 'bg-gray-800 text-white' 
            : 'bg-white text-gray-900 border border-gray-300'
        }`}
      >
        All Guests ({guestsCount})
      </button>
    </div>
  );
}