// src/data/drink-options.ts

// Import the raw JSON data directly.
// Next.js will handle the file reading during the build process.
import products from '../../checkers_products_selenium.json';
import { Product } from '../components/admin/types'; 

export interface DrinkOption {
  id: string;
  name: string;
  category: 'spirits' | 'Beer' | 'Soft Drinks' | 'Ciders';
  description?: string;
  imageUrl?: string; 
}

/**
 * Determines the category of a drink based on its name.
 * This is a simple categorization logic. You can expand it as needed.
 * @param {string} name - The name of the product.
 * @returns {DrinkOption['category']} - The determined category.
 */
function getCategoryFromName(name: string): DrinkOption['category'] {
  const lowerCaseName = name.toLowerCase();
  const spiritKeywords = ['whisky', 'gin', 'vodka', 'rum', 'brandy', 'tequila', 'jaggermeister', 'richelieu', 'klipdrift'];
  const beerKeywords = ['beer', 'lager', 'cider', 'ale', 'brutal fruit', 'savanna', 'hunters'];
  const mixKeywords = ['coke', 'coca-cola', 'cream soda', 'sprite', 'soda water', 'tonic', 'dry lemon', 'sparkling water'];

  if (spiritKeywords.some(keyword => lowerCaseName.includes(keyword))) {
    return 'spirits';
  }
  if (beerKeywords.some(keyword => lowerCaseName.includes(keyword))) {
    return 'Beer';
  }
  if (mixKeywords.some(keyword => lowerCaseName.includes(keyword))) {
    return 'Soft Drinks';
  }
  if (mixKeywords.some(keyword => lowerCaseName.includes(keyword))) {
    return 'Ciders';
  }
  // Default to 'spirits' if no category matches, or choose another default.
  return 'Beer';
}

/**
 * Transforms the raw product data from the JSON file into the DrinkOption format.
 * It also generates a unique ID for each product.
 * @param {Array<Object>} rawProducts - The array of products from the JSON file.
 * @returns {DrinkOption[]} - The formatted and categorized list of drinks.
 */
const transformProducts = (rawProducts: Product[]): DrinkOption[] => {
  return rawProducts.map((product, index) => {
    // Sanitize the product name to create a more robust ID.
    const sanitizedName = product.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    const id = `${sanitizedName}_${index}`; // Add index to ensure uniqueness

    return {
      id: id,
      name: product.name,
      category: getCategoryFromName(product.name),
      description: product.name,
      imageUrl: product.image_url,
    };
  });
};

// The main constant that holds all drink options, now dynamically generated.
export const DRINK_OPTIONS: DrinkOption[] = transformProducts(products);

// Categorieë vir groepering
export const DRINK_CATEGORIES = [
  { id: 'spirits', name: 'Harde Hout' },
  { id: 'Beer', name: 'Bier & Ciders' }, // Updated name for clarity
  { id: 'Ciders', name: 'Bier & Ciders' }, // Updated name for clarity
  { id: 'Soft Drinks', name: 'Koeldrank & Mengers' }, // Updated name for clarity
] as const;

// --- Helper Functions (No changes needed below this line) ---
// These functions will now work with the dynamically loaded data.

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
    drink.category === category 
  );
};