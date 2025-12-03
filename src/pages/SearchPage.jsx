import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../utils/LanguageContext';
import { loadData, setPageTitle, setPageMeta } from '../utils/helpers';
import Breadcrumb from '../components/Breadcrumb';
import ProductCard from '../components/ProductCard';

const SearchPage = () => {
  const { t, language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');

  // Initialize state from URL parameters
  useEffect(() => {
    const urlSearchTerm = searchParams.get('q') || '';
    const urlCategory = searchParams.get('category') || '';
    const urlSubCategory = searchParams.get('subcategory') || '';
    
    console.log('URL Parameters:', {
      searchTerm: urlSearchTerm,
      category: urlCategory,
      subcategory: urlSubCategory
    });
    
    setSearchTerm(urlSearchTerm);
    setSelectedCategory(urlCategory);
    setSelectedSubCategory(urlSubCategory);
    
    console.log('State updated:', {
      searchTerm: urlSearchTerm,
      selectedCategory: urlCategory,
      selectedSubCategory: urlSubCategory
    });
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, categoriesData, subCategoriesData] = await Promise.all([
          loadData('products.json'),
          loadData('categories.json'),
          loadData('sub-categories.json')
        ]);
        
        console.log('Loaded data:', {
          products: productsData.length,
          categories: categoriesData.length,
          subCategories: subCategoriesData.length
        });
        
        setProducts(productsData);
        setCategories(categoriesData);
        setSubCategories(subCategoriesData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setPageTitle(t('search.title'));
    setPageMeta(t('search.description'), t('search.title'));
  }, [t]);

  useEffect(() => {
    const filterProducts = () => {
      let filtered = [...products];
      
      console.log('Filtering products:', {
        totalProducts: products.length,
        searchTerm,
        selectedCategory,
        selectedSubCategory,
        language
      });
      
      // Debug: Check if we're searching for "sả"
      if (searchTerm === 'sả') {
        console.log('🔍 Searching for "sả" - this should find the lemongrass product');
      }

      // Filter by search term
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase().trim();
        console.log('Searching for term:', term);
        
        filtered = filtered.filter(product => {
          // Handle multilingual product names
          let productName = '';
          if (typeof product.name === 'object') {
            productName = product.name[language] || product.name.vi || '';
          } else {
            productName = product.name || '';
          }
          
          // Handle multilingual descriptions
          let productDescription = '';
          if (typeof product.description === 'object') {
            productDescription = product.description[language] || product.description.vi || '';
          } else {
            productDescription = product.description || '';
          }
          
          const nameMatches = productName.toLowerCase().includes(term);
          const descMatches = productDescription.toLowerCase().includes(term);
          const matches = nameMatches || descMatches;
          
          // Special debug for "sả" search
          if (term === 'sả' && (productName.toLowerCase().includes('sả') || productName === 'Sả')) {
            console.log('Found sả product:', {
              id: product.id,
              name: productName,
              nameMatches,
              descMatches,
              matches
            });
          }
          
          if (matches) {
            console.log('Product matches search term:', productName);
          }
          
          return matches;
        });
        console.log('After search filter:', filtered.length);
      }

      // Filter by category
      if (selectedCategory) {
        const beforeCategoryFilter = filtered.length;
        filtered = filtered.filter(product => product.categoryId === selectedCategory);
        console.log('After category filter:', filtered.length, 'was:', beforeCategoryFilter);
      }

      // Filter by subcategory
      if (selectedSubCategory) {
        const beforeSubCategoryFilter = filtered.length;
        filtered = filtered.filter(product => {
          // If product doesn't have subCategoryId, skip it
          if (!product.subCategoryId) {
            return false;
          }
          return product.subCategoryId === selectedSubCategory;
        });
        console.log('After subcategory filter:', filtered.length, 'was:', beforeSubCategoryFilter);
      }

      console.log('Final filtered products:', filtered.length);
      setFilteredProducts(filtered);
    };

    filterProducts();
  }, [products, searchTerm, selectedCategory, selectedSubCategory, language]);

  const handleSearch = (e) => {
    e.preventDefault();
    updateSearchParams();
  };

  const updateSearchParams = () => {
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set('q', searchTerm.trim());
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedSubCategory) params.set('subcategory', selectedSubCategory);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedSubCategory('');
    setSearchParams({});
  };

  const getAvailableSubCategories = () => {
    if (!selectedCategory) return subCategories;
    return subCategories.filter(sub => sub.categoryId === selectedCategory);
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return '';
    
    // Handle multilingual names
    if (typeof category.name === 'object') {
      return category.name[language] || category.name.vi || '';
    }
    return category.name || '';
  };

  const getSubCategoryName = (subCategoryId) => {
    const subCategory = subCategories.find(sub => sub.id === subCategoryId);
    if (!subCategory) return '';
    
    // Handle multilingual names
    if (typeof subCategory.name === 'object') {
      return subCategory.name[language] || subCategory.name.vi || '';
    }
    return subCategory.name || '';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  const breadcrumbs = [
    { label: t('breadcrumb.home'), to: '/' },
    { label: t('search.title'), to: '/search' }
  ];

  return (
    <div className="flex flex-col bg-white min-h-screen">
      <div className="container mx-auto px-4 lg:px-8 py-6">
        {/* Breadcrumb */}
        <Breadcrumb customItems={breadcrumbs} />

        {/* Page Title */}
        <h1 className="text-black text-2xl md:text-3xl lg:text-4xl font-bold mb-8 text-center lg:text-left">
          {t('search.title')}
        </h1>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Search Input */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                {t('search.searchLabel')}
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('search.searchPlaceholder')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category Filter */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('search.categoryFilter')}
                </label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedSubCategory(''); // Reset subcategory when category changes
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">{t('search.allCategories')}</option>
                  {categories.map((category) => {
                    const categoryName = typeof category.name === 'object' 
                      ? category.name[language] || category.name.vi || ''
                      : category.name || '';
                    return (
                      <option key={category.id} value={category.id}>
                        {categoryName}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Subcategory Filter */}
              <div>
                <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('search.subcategoryFilter')}
                </label>
                <select
                  id="subcategory"
                  value={selectedSubCategory}
                  onChange={(e) => setSelectedSubCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  disabled={!selectedCategory}
                >
                  <option value="">{t('search.allSubcategories')}</option>
                  {getAvailableSubCategories().map((subCategory) => {
                    const subCategoryName = typeof subCategory.name === 'object' 
                      ? subCategory.name[language] || subCategory.name.vi || ''
                      : subCategory.name || '';
                    return (
                      <option key={subCategory.id} value={subCategory.id}>
                        {subCategoryName}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
              >
                {t('search.searchButton')}
              </button>
              <button
                type="button"
                onClick={clearFilters}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
              >
                {t('search.clearFilters')}
              </button>
            </div>
          </form>
        </div>

        {/* Active Filters */}
        {(searchTerm || selectedCategory || selectedSubCategory) && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">{t('search.activeFilters')}:</h3>
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {t('search.searchTerm')}: "{searchTerm}"
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      updateSearchParams();
                    }}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedCategory && (
                <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {t('search.category')}: {getCategoryName(selectedCategory)}
                  <button
                    onClick={() => {
                      setSelectedCategory('');
                      setSelectedSubCategory('');
                      updateSearchParams();
                    }}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedSubCategory && (
                <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                  {t('search.subcategory')}: {getSubCategoryName(selectedSubCategory)}
                  <button
                    onClick={() => {
                      setSelectedSubCategory('');
                      updateSearchParams();
                    }}
                    className="ml-2 text-purple-600 hover:text-purple-800"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Results */}
        <div className="mb-6">
          <h2 className="text-xl md:text-2xl font-bold mb-4">
            {t('search.results')} ({filteredProducts.length})
          </h2>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="w-full">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-4">
                {t('search.noResults')}
              </div>
              <p className="text-gray-400 mb-6">
                {t('search.noResultsDescription')}
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                {t('search.viewAllProducts')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
