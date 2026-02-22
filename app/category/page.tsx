// app/categories/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { newArrivalProducts, NewArrivalProduct } from '../Desktop/data/newproducts';
import ProductCard from '../Desktop/components/ProductCard';
import ProductDetailsModal from '../Desktop/components/ProductDetailsModal';
import SearchFilterBar from '../Desktop/components/SearchFilterBar';
import { FilterOptions } from '../Desktop/utils/filterProducts';
import { FaStar, FaCheckCircle, FaEye } from 'react-icons/fa';

export default function CategoriesPage() {
  // Get all unique categories
  const allCategories = ['All Products', ...Array.from(new Set(newArrivalProducts.map(p => p.category)))];
  
  // State
  const [selectedCategory, setSelectedCategory] = useState<string>('All Products');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filteredProducts, setFilteredProducts] = useState<NewArrivalProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<NewArrivalProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: '',
    minPrice: 0,
    maxPrice: 5000,
    categories: [],
    sortBy: 'default',
    showOnSale: false,
    showInStock: true,
    showNewArrivals: false,
    showBestSellers: false,
  });

  // Initialize with all products
  useEffect(() => {
    setFilteredProducts(newArrivalProducts);
  }, []);

  // Handle category selection
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    
    if (category === 'All Products') {
      setFilters({
        ...filters,
        categories: []
      });
    } else {
      setFilters({
        ...filters,
        categories: [category]
      });
    }
  };

  // Handle filter changes from SearchFilterBar
  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setSearchQuery(newFilters.searchQuery || '');
    
    // Filter products
    let products = [...newArrivalProducts];

    // Filter by category
    if (selectedCategory !== 'All Products') {
      products = products.filter(product => product.category === selectedCategory);
    }

    // Filter by search query
    if (newFilters.searchQuery) {
      const query = newFilters.searchQuery.toLowerCase();
      products = products.filter(product => 
        product.nameEn.toLowerCase().includes(query) ||
        product.nameUr.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }

    // Filter by price
    products = products.filter(product => 
      product.price >= newFilters.minPrice && product.price <= newFilters.maxPrice
    );

    // Filter by categories from SearchFilterBar
    if (newFilters.categories.length > 0) {
      products = products.filter(product => 
        newFilters.categories.includes(product.category)
      );
    }

    // Filter by sale
    if (newFilters.showOnSale) {
      products = products.filter(product => product.sale);
    }

    // Sort products
    switch (newFilters.sortBy) {
      case 'price-low':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        products.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        products.sort((a, b) => a.nameEn.localeCompare(b.nameEn));
        break;
      default:
        // Keep original order
        break;
    }

    setFilteredProducts(products);
  };

  // Handle view mode change
  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
  };

  // Handle quick view
  const handleQuickView = (product: NewArrivalProduct) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Get product count by category
  const getProductCountByCategory = (category: string) => {
    if (category === 'All Products') {
      return newArrivalProducts.length;
    }
    return newArrivalProducts.filter(product => product.category === category).length;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Simple */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
            Shop by Category
          </h1>
          <p className="text-gray-600 text-center">
            Browse our collection of natural products
          </p>
        </div>
      </div>

      {/* Search and Filter Bar - Moved before category menu */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <SearchFilterBar
          onFilterChange={handleFilterChange}
          onViewModeChange={handleViewModeChange}
          productCount={filteredProducts.length}
          categories={allCategories.filter(cat => cat !== 'All Products')}
          initialSearchQuery={searchQuery}
        />
      </div>

      {/* Category Menu Bar */}
      <div className="bg-white border-b border-gray-200 mt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="overflow-x-auto">
            <div className="flex space-x-1 py-3">
              {allCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-full transition ${
                    selectedCategory === category
                      ? 'bg-green-700 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                  <span className={`ml-1 text-xs ${
                    selectedCategory === category ? 'text-white/80' : 'text-gray-500'
                  }`}>
                    ({getProductCountByCategory(category)})
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {selectedCategory === 'All Products' ? 'All Products' : selectedCategory}
            </h2>
            <p className="text-gray-600 text-sm">
              Showing {filteredProducts.length} products
            </p>
          </div>
          
          {/* Sort Info */}
          {filters.sortBy !== 'default' && (
            <div className="text-sm text-gray-600 mt-2 sm:mt-0">
              Sorted by: <span className="font-medium">
                {filters.sortBy === 'price-low' && 'Price: Low to High'}
                {filters.sortBy === 'price-high' && 'Price: High to Low'}
                {filters.sortBy === 'rating' && 'Highest Rated'}
                {filters.sortBy === 'name' && 'Name (A-Z)'}
              </span>
            </div>
          )}
        </div>

        {/* Products Display */}
        {filteredProducts.length > 0 ? (
          viewMode === 'grid' ? (
            // Grid View
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            // List View with Quick View button
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <div 
                  key={product.id}
                  className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow p-4"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Product Image */}
                    <div className="w-full md:w-48 h-48 flex-shrink-0">
                      <img 
                        src={product.img}
                        alt={product.nameEn}
                        className="w-full h-full object-cover rounded-lg"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/product.png';
                        }}
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {product.nameEn}
                        </h3>
                        <p className="text-lg text-gray-600 mb-3">{product.nameUr}</p>
                        {product.description && (
                          <p className="text-sm text-green-700 mb-4">{product.description}</p>
                        )}

                        {/* Rating & Reviews */}
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center gap-1">
                            <FaStar className="w-5 h-5 text-yellow-400" />
                            <span className="font-semibold">{product.rating}</span>
                          </div>
                          <div className="flex items-center gap-1 text-green-600">
                            <FaCheckCircle className="w-5 h-5" />
                            <span>{product.reviews} Reviews</span>
                          </div>
                        </div>
                      </div>

                      {/* Price and Quick View */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-bold text-gray-900">
                            PKR {product.price.toLocaleString()}
                          </span>
                          {product.oldPrice && (
                            <span className="text-lg text-gray-500 line-through">
                              PKR {product.oldPrice.toLocaleString()}
                            </span>
                          )}
                          {product.sale && (
                            <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-semibold">
                              {product.sale}
                            </span>
                          )}
                        </div>

                        <button 
                          className="px-8 py-3 bg-green-700 text-white rounded-full hover:bg-green-600 transition font-semibold flex items-center justify-center gap-2"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleQuickView(product);
                          }}
                        >
                          <FaEye className="w-4 h-4" />
                          Quick View
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">
              {filters.searchQuery 
                ? `No results found for "${filters.searchQuery}"`
                : 'Try selecting a different category'}
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All Products');
                handleFilterChange({
                  searchQuery: '',
                  minPrice: 0,
                  maxPrice: 5000,
                  categories: [],
                  sortBy: 'default',
                  showOnSale: false,
                  showInStock: true,
                  showNewArrivals: false,
                  showBestSellers: false,
                });
              }}
              className="px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
            >
              View All Products
            </button>
          </div>
        )}
      </div>

      {/* Product Details Modal */}
      {isModalOpen && selectedProduct && (
        <ProductDetailsModal 
          product={selectedProduct} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
}