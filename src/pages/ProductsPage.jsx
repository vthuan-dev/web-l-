import React, { useState, useEffect } from 'react';
import { useLanguage } from '../utils/LanguageContext';
import { loadData, setPageTitle, setPageMeta } from '../utils/helpers';
import Breadcrumb from '../components/Breadcrumb';
import CategoryCard from '../components/CategoryCard';

const ProductsPage = () => {
  const { t } = useLanguage();
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesData = await loadData('categories.json');
        setCategories(categoriesData);
        setSubCategories([]);
      } catch (error) {
        console.error('Error loading products data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setPageTitle(t('nav.products'));
    setPageMeta('Danh sách tất cả sản phẩm của Wizus Food', t('nav.products'));
  }, [t]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white min-h-screen">
      <div className="container mx-auto px-4 lg:px-8 py-6">
        {/* Breadcrumb */}
        <Breadcrumb />

        {/* Page Title */}
        <h1 className="text-black text-2xl md:text-3xl lg:text-4xl font-bold mb-8 lg:mb-12 text-center lg:text-left">
          {t('products.categories')}
        </h1>

        {/* Categories Grid */}
        <div className="mb-12 lg:mb-16">
          {/* Main Categories */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 sm:gap-8 lg:gap-10 mb-12 lg:mb-16">
            {categories.map((category) => (
              <div key={category.id} className="w-full max-w-sm mx-auto lg:max-w-none transform hover:scale-105 transition-transform duration-300">
                <CategoryCard 
                  category={category} 
                  productCount={0}
                />
              </div>
            ))}
          </div>

          {/* Sub-categories removed as requested */}

        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
