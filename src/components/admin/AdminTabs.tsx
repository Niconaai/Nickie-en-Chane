import React from 'react';

interface AdminTabsProps {
  activeTab: 'families' | 'guests' | 'payments' | 'songs' | 'drinks';
  onTabChange: (tab: 'families' | 'guests' | 'payments' | 'songs' | 'drinks') => void;
  familiesCount: number;
  guestsCount: number;
  paymentsCount: number;
}

export default function AdminTabs({
  activeTab,
  onTabChange,
  familiesCount,
  guestsCount,
  paymentsCount
}: AdminTabsProps) {
  const getTabClass = (tabName: string) => `px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
    activeTab === tabName 
      ? 'bg-[#3d251e] text-white' 
      : 'bg-white text-[#3d251e] border border-gray-300 hover:bg-gray-50'
  }`;

  return (
    <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
      <button onClick={() => onTabChange('families')} className={getTabClass('families')}>
        Families ({familiesCount})
      </button>
      <button onClick={() => onTabChange('guests')} className={getTabClass('guests')}>
        Gaste ({guestsCount})
      </button>
      <button onClick={() => onTabChange('payments')} className={getTabClass('payments')}>
        Betalings ({paymentsCount})
      </button>
      
      {/* Nuwe Tabs */}
      <button onClick={() => onTabChange('songs')} className={getTabClass('songs')}>
        Liedjies
      </button>
      <button onClick={() => onTabChange('drinks')} className={getTabClass('drinks')}>
        Drankies
      </button>
    </div>
  );
}