// app/Desktop/utils/filterProducts.ts
export interface Product {
  id: string | number;
  img: string;
  nameEn: string;
  nameUr: string;
  description: string;
  rating: number;
  reviews: number;
  price: number;
  oldPrice?: number;
  sale?: string;
  category?: string;
  inStock?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  tags?: string[];
  [key: string]: any;
}

export interface FilterOptions {
  searchQuery: string;
  minPrice: number;
  maxPrice: number;
  categories: string[];
  sortBy: 'default' | 'price-low' | 'price-high' | 'rating' | 'name';
  showOnSale: boolean;
  showInStock: boolean;
  showNewArrivals?: boolean;
  showBestSellers?: boolean;
}

export function filterProducts(products: Product[], filters: FilterOptions): Product[] {
  // Check if products is valid
  if (!products || !Array.isArray(products)) {
    console.error('Invalid products array:', products);
    return [];
  }

  // Start with all products
  let filtered = [...products];

  // Search filter
  if (filters.searchQuery.trim()) {
    const query = filters.searchQuery.toLowerCase().trim();
    filtered = filtered.filter(product => {
      if (!product) return false;
      
      return (
        (product.nameEn?.toLowerCase() || '').includes(query) ||
        (product.nameUr?.toLowerCase() || '').includes(query) ||
        (product.description?.toLowerCase() || '').includes(query) ||
        (product.category?.toLowerCase() || '').includes(query) ||
        (product.tags?.some(tag => tag.toLowerCase().includes(query)) || false)
      );
    });
  }

  // Price filter
  filtered = filtered.filter(product => {
    const price = product?.price || 0;
    return price >= filters.minPrice && price <= filters.maxPrice;
  });

  // Category filter
  if (filters.categories.length > 0) {
    filtered = filtered.filter(product => {
      return product?.category && filters.categories.includes(product.category);
    });
  }

  // On sale filter
  if (filters.showOnSale) {
    filtered = filtered.filter(product => product?.sale || product?.oldPrice);
  }

  // In stock filter
  if (filters.showInStock) {
    filtered = filtered.filter(product => product?.inStock !== false);
  }

  // New arrivals filter
  if (filters.showNewArrivals) {
    filtered = filtered.filter(product => product?.isNew === true);
  }

  // Best sellers filter
  if (filters.showBestSellers) {
    filtered = filtered.filter(product => product?.isBestSeller === true);
  }

  // Sort products
  switch (filters.sortBy) {
    case 'price-low':
      filtered.sort((a, b) => (a?.price || 0) - (b?.price || 0));
      break;
    case 'price-high':
      filtered.sort((a, b) => (b?.price || 0) - (a?.price || 0));
      break;
    case 'rating':
      filtered.sort((a, b) => (b?.rating || 0) - (a?.rating || 0));
      break;
    case 'name':
      filtered.sort((a, b) => 
        (a?.nameEn || '').localeCompare(b?.nameEn || '')
      );
      break;
    default:
      // Keep original order or sort by new/best seller first
      filtered.sort((a, b) => {
        if (a.isBestSeller && !b.isBestSeller) return -1;
        if (!a.isBestSeller && b.isBestSeller) return 1;
        if (a.isNew && !b.isNew) return -1;
        if (!a.isNew && b.isNew) return 1;
        return 0;
      });
      break;
  }

  return filtered;
}

// Helper function to extract unique categories from products
export function getCategoriesFromProducts(products: Product[]): string[] {
  // Check if products is valid
  if (!products || !Array.isArray(products)) {
    console.error('Invalid products array in getCategoriesFromProducts:', products);
    return [];
  }

  const categories = new Set<string>();
  
  products.forEach(product => {
    if (product?.category && typeof product.category === 'string') {
      categories.add(product.category.trim());
    }
  });
  
  // Sort categories alphabetically
  return Array.from(categories).sort((a, b) => a.localeCompare(b));
}

// Helper function to get price range from products
export function getPriceRangeFromProducts(products: Product[]): { min: number; max: number } {
  if (!products || products.length === 0) {
    return { min: 0, max: 5000 };
  }
  
  const prices = products.map(p => p.price);
  return {
    min: Math.floor(Math.min(...prices) / 100) * 100, // Round down to nearest 100
    max: Math.ceil(Math.max(...prices) / 100) * 100,   // Round up to nearest 100
  };
}