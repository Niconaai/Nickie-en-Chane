export interface DrinkOption {
  id: string;
  name: string;
  category: 'spirits' | 'bier' | 'mix';
  description?: string;
}

export const DRINK_OPTIONS: DrinkOption[] = [
  // Harde Houte
  { id: 'whiskey_JB', name: 'J&B', category: 'spirits', description: 'J&B' },
  { id: 'whiskey_Bells', name: 'Bells', category: 'spirits', description: 'Bells' },
  { id: 'whiskey_JD', name: 'Jack Daniels', category: 'spirits', description: 'Jack Daniels' },
  { id: 'whiskey_JWR', name: 'Johnny Walker Red', category: 'spirits', description: 'Johnny Walker Red' },
  { id: 'whiskey_JMS', name: 'Jameson', category: 'spirits', description: 'Jameson' },
  { id: 'gin_Gordons', name: 'Gordons Dry Gin', category: 'spirits', description: 'Gordons Gin' },
  { id: 'gin_Belgravia', name: 'Belgravia', category: 'spirits', description: 'Belgravia Gin' },
  { id: 'vodka', name: 'Smirnoff 1818', category: 'spirits', description: 'Smirnoff Vodka' },
  { id: 'rum_SG', name: 'Captain Morgan Spiced Gold Rum', category: 'spirits', description: 'Spiced Gold Rum' },
  { id: 'rum_RH', name: 'Red Heart Rum', category: 'spirits', description: 'Red Heart Rum' },
  { id: 'rum_CMD', name: 'Captain Morgain Dark Rum', category: 'spirits', description: 'CM Dark Rum' },
  { id: 'brandy_Rich', name: 'Richelieu Brandewyn', category: 'spirits', description: 'Richelieu Brandewyn' },
  { id: 'brandy_KD', name: 'Klipdrift', category: 'spirits', description: 'Klipdrift' },
  { id: 'brandy_OB', name: 'Olof Bergh', category: 'spirits', description: 'Olof Bergh' },
  { id: 'brandy_KWV3', name: 'KWV 3 Jaar', category: 'spirits', description: 'KWV 3 Jaar' },
  { id: 'tequila', name: 'Tequila', category: 'spirits', description: 'Tequila' },
  { id: 'jagger', name: 'Jaggermeister', category: 'spirits', description: 'Jaggermeister' },

  // Bier
  { id: 'beer_CL', name: 'Castle Light', category: 'bier', description: 'Castle Light' },
  { id: 'beer_BL', name: 'Black Label', category: 'bier', description: 'Black Label' },
  { id: 'beer_AL', name: 'Amstel Lager', category: 'bier', description: 'Amstel Lager' },
  { id: 'beer_HL', name: 'Heineken Lager', category: 'bier', description: 'Heineken Lager' },
  { id: 'cider_HuntersGold', name: 'Hunters Gold Cider', category: 'bier', description: 'Hunters Gold' },
  { id: 'cider_HuntersDry', name: 'Hunters Dry Cider', category: 'bier', description: 'Hunters Dry' },
  { id: 'cider_SavannaDry', name: 'Savanna Dry', category: 'bier', description: 'Savanna Dry' },
  { id: 'cider_SavannaLight', name: 'Savanna Light', category: 'bier', description: 'Savanna Light' },
  { id: 'chicks_Brutal', name: 'Brutal Fruit', category: 'bier', description: 'Brutal Fruit' },

  // Ander
  { id: 'Coke', name: 'Coca-Cola', category: 'mix', description: 'Coca-Cola Normal' },
  { id: 'CokeZ', name: 'Coca-Cola Zero', category: 'mix', description: 'Coca-Cola Zero' },
  { id: 'CokeL', name: 'Coca-Cola Light', category: 'mix', description: 'Coca-Cola Light' },
  { id: 'CreamS', name: 'Cream Soda', category: 'mix', description: 'Cream Soda' },
  { id: 'Sprite', name: 'Sprite', category: 'mix', description: 'Sprite' },
  { id: 'SpriteZ', name: 'Sprite Zero', category: 'mix', description: 'Sprite Zero' },
  { id: 'SodaWater', name: 'Soda Water', category: 'mix', description: 'Soda Water' },
  { id: 'Sparkling', name: 'Sparkling Water', category: 'mix', description: 'Sparkling Water' },
  { id: 'TonicWater', name: 'Tonic Water', category: 'mix', description: 'Tonic Water' },
  { id: 'DryLemon', name: 'DryLemon', category: 'mix', description: 'Dry Lemon' },
] as const;

// Hulp funksies
export const getDrinkOptionsByCategory = (category: DrinkOption['category']) => {
  return DRINK_OPTIONS.filter(drink => drink.category === category);
};

export const getDrinkById = (id: string) => {
  return DRINK_OPTIONS.find(drink => drink.id === id);
};

export const searchDrinksByName = (searchTerm: string): DrinkOption[] => {
  if (!searchTerm.trim()) return [];
  
  const term = searchTerm.toLowerCase().trim();
  return DRINK_OPTIONS.filter(drink => 
    drink.name.toLowerCase().includes(term) || 
    drink.description?.toLowerCase().includes(term)
  );
};

export const searchDrinksInCategory = (searchTerm: string, category: DrinkOption['category']): DrinkOption[] => {
  if (!searchTerm.trim()) return getDrinkOptionsByCategory(category);
  
  const term = searchTerm.toLowerCase().trim();
  return DRINK_OPTIONS.filter(drink => 
    drink.category === category &&
    (drink.name.toLowerCase().includes(term) || 
     drink.description?.toLowerCase().includes(term))
  );
};

// Categorieë vir groepering
export const DRINK_CATEGORIES = [
  { id: 'spirits', name: 'Harde Hout' },
  { id: 'bier', name: 'Bier' },
  { id: 'mix', name: 'Koeldrank & Mixers' },
] as const;