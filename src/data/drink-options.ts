// src/data/drink-options.ts

// Import the raw JSON data directly.
// Next.js will handle the file reading during the build process.
import products from '../../checkers_products_selenium.json';
import { Product } from '../components/admin/types';

const drinkCategories = ['spirits', 'Beer', 'Soft Drinks', 'Ciders'] as const;

export interface DrinkOption {
  id: string;
  name: string;
  category: typeof drinkCategories[number];
  description?: string;
  imageUrl?: string;
}


function isDrinkCategory(category: string): category is DrinkOption['category'] {
  return (drinkCategories as readonly string[]).includes(category);
}
/**
 * Transforms the raw product data from the JSON file into the DrinkOption format.
 * It also generates a unique ID for each product.
 * @param {Array<Object>} rawProducts - The array of products from the JSON file.
 * @returns {DrinkOption[]} - The formatted and categorized list of drinks.
 * 
 */
export const transformProducts = (rawProducts: Product[]): DrinkOption[] => {
  return rawProducts
    .map((product, index) => {
      // Use the type guard to validate the category from the source data.
      if (!isDrinkCategory(product.category)) {
        console.warn(`Invalid category "${product.category}" for product "${product.name}". Skipping.`);
        return {
          id: '',
          name: '',
          category: drinkCategories[1], // This is now type-safe
          description: '',
          imageUrl: '',
        }
      }

      const sanitizedName = product.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
      const id = `${sanitizedName}_${index}`;

      // Because of the `isDrinkCategory` check, TypeScript now knows
      // that `product.category` is a valid `DrinkOption['category']`.
      return {
        id: id,
        name: product.name,
        category: product.category, // This is now type-safe
        description: product.name,
        imageUrl: product.image_url,
      };
    })
    
};

// The main constant that holds all drink options, now dynamically generated.
export const DRINK_OPTIONS: DrinkOption[] = transformProducts(products);

// Categorieë vir groepering
export const DRINK_CATEGORIES = [
  { id: 'spirits', name: 'Harde Hout' },
  { id: 'Beer', name: 'Bier' },
  { id: 'Ciders', name: 'Ciders' },
  { id: 'Soft Drinks', name: 'Koeldrank & Mengers' },
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
    drink.category === category &&
    (drink.name.toLowerCase().includes(term) ||
      drink.description?.toLowerCase().includes(term))
  );
};