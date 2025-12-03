import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from '../utils/LanguageContext';
import { loadData } from '../utils/helpers';
import Breadcrumb from '../components/Breadcrumb';
import CategoryCard from '../components/CategoryCard';

const SubCategoryPage = () => {
  const { slug } = useParams();
  const { t, language } = useLanguage();
  const [product, setProduct] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, subCategoriesData, categoriesData] = await Promise.all([
          loadData('products.json'),
          loadData('sub-categories.json'),
          loadData('categories.json')
        ]);

        // Find product by slug
        const foundProduct = productsData.find(prod => prod.slug === slug);
        
        if (foundProduct) {
          setProduct(foundProduct);
          
          // Find sub-categories for this product
          const productSubCategories = subCategoriesData.filter(sub => 
            sub.parentProductId === foundProduct.id
          );
          setSubCategories(productSubCategories);
        }
      } catch (error) {
        console.error('Error loading sub-category data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const getProductName = () => {
    if (product && typeof product.name === 'object') {
      return product.name[language] || product.name.vi;
    }
    return product?.name;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Product not found</div>
      </div>
    );
  }

  const breadcrumbs = [
    { label: t('breadcrumb.home'), to: '/' },
    { label: t('breadcrumb.categories'), to: '/products' },
    { label: language === 'vi' ? 'Cá tra' : 'Pangasius', to: '/category/ca-tra' },
    { label: getProductName(), to: `/product/${product.slug}` }
  ];

  return (
    <div className="flex flex-col bg-white min-h-screen">
      <div className="container mx-auto px-4 lg:px-8 py-6">
        {/* Breadcrumb */}
        <Breadcrumb customItems={breadcrumbs} />

        {/* Product Title */}
        <h1 className="text-black text-2xl md:text-3xl lg:text-4xl font-bold mb-8 lg:mb-12 text-center lg:text-left">
          {getProductName()}
        </h1>

        {/* Sub-categories Grid */}
        <div className="mb-8">
          {subCategories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {subCategories.map((subCategory) => (
                <div key={subCategory.id} className="w-full max-w-sm mx-auto lg:max-w-none">
                  <CategoryCard category={subCategory} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-lg md:text-xl text-gray-500 py-20">
              <div>{language === 'vi' ? 'Không có sản phẩm nào trong danh mục này' : 'No products found in this category'}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubCategoryPage;
