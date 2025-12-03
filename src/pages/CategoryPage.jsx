import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from '../utils/LanguageContext';
import { loadData, setPageTitle, setPageMeta } from '../utils/helpers';
import Breadcrumb from '../components/Breadcrumb';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';

const CategoryPage = () => {
  const { slug } = useParams();
  const { t, language } = useLanguage();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [subCategoriesForCategory, setSubCategoriesForCategory] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, subCategoriesData, productsData] = await Promise.all([
          loadData('categories.json'),
          loadData('sub-categories.json'),
          loadData('products.json')
        ]);

        // Find category by slug (main categories or sub-categories)
        let foundCategory = categoriesData.find(cat => cat.slug === slug);
        if (!foundCategory) {
          foundCategory = subCategoriesData.find(cat => cat.slug === slug);
        }

        if (foundCategory) {
          setCategory(foundCategory);
          
          // Debug logging
          console.log('Found category:', foundCategory);
          console.log('Category ID:', foundCategory.id);
          console.log('All products count:', productsData.length);
          
          // If viewing a MAIN category
          const isMainCategory = !!categoriesData.find(cat => cat.id === foundCategory.id);
          if (isMainCategory) {
            // For main categories, show sub-categories if they exist, otherwise show products
            const subs = subCategoriesData.filter(sc => sc.categoryId === foundCategory.id);
            if (subs.length > 0) {
              // Show sub-categories when they exist
              setSubCategoriesForCategory(subs);
              setProducts([]);
            } else {
              // If no sub-categories, list products directly by main category
              const productsInMainCategory = productsData.filter(p => p.categoryId === foundCategory.id);
              setProducts(productsInMainCategory);
              setSubCategoriesForCategory([]);
              
              // Set the first product as selected by default for main categories too
              if (productsInMainCategory.length > 0) {
                setSelectedProduct(productsInMainCategory[0]);
                setSelectedImageIndex(0);
              }
            }
          } else if (foundCategory.slug === 'cha-ca') {
            // Special case for Chả cá - get all products with categoryId = cha-ca
            const chaCaProducts = productsData.filter(p => p.categoryId === foundCategory.id);
            setProducts(chaCaProducts);
            setSubCategoriesForCategory([]);
            
            // Set the first product as selected by default
            if (chaCaProducts.length > 0) {
              setSelectedProduct(chaCaProducts[0]);
              setSelectedImageIndex(0);
            }
          } else {
            // Otherwise viewing a sub-category → list products tagged with this sub-category
            const categoryProducts = productsData.filter(product => {
              return product.subCategoryId === foundCategory.id;
            });
            setProducts(categoryProducts);
            setSubCategoriesForCategory([]);
            
            // Set the first product as selected by default
            if (categoryProducts.length > 0) {
              setSelectedProduct(categoryProducts[0]);
              setSelectedImageIndex(0);
            }
          }
          
          console.log('Sub-categories count:', subCategoriesForCategory.length);
          console.log('Products count:', products.length);
        }
      } catch (error) {
        console.error('Error loading category data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  // derive name inline to avoid stale deps in effects
  const derivedCategoryName = category && typeof category.name === 'object'
    ? (category.name[language] || category.name.vi)
    : category?.name;

  useEffect(() => {
    if (category) {
      setPageTitle(derivedCategoryName);
      setPageMeta(`${t('categoryPage.metaDescription')} ${derivedCategoryName}`, derivedCategoryName);
    }
  }, [category, derivedCategoryName, t]);

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

  if (!category) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Category not found</div>
      </div>
    );
  }

  const breadcrumbs = [
    { label: t('breadcrumb.home'), to: '/' },
    { label: t('breadcrumb.categories'), to: '/products' },
    { label: derivedCategoryName, to: `/category/${category.slug}` }
  ];

  return (
    <div className="flex flex-col bg-white min-h-screen">
      <div className="container mx-auto px-4 lg:px-8 py-6">
        {/* Breadcrumb */}
        <Breadcrumb customItems={breadcrumbs} />

        {/* Category Title */}
        <h1 className="text-black text-2xl md:text-3xl lg:text-4xl font-bold mb-8 lg:mb-12 text-center lg:text-left">
          {products.length === 1 && selectedProduct 
            ? (typeof selectedProduct.name === 'object' ? (selectedProduct.name[language] || selectedProduct.name.vi) : selectedProduct.name)
            : derivedCategoryName
          }
        </h1>

        {/* If sub-categories exist (for main category), render them */}
        {subCategoriesForCategory.length > 0 ? (
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
              {subCategoriesForCategory.map((sub) => (
                <div key={sub.id} className="w-full max-w-sm mx-auto lg:max-w-none transform hover:scale-105 transition-transform duration-300">
                  <CategoryCard category={sub} productCount={0} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Render products - check if this is a main category or sub-category */
          <div className="mb-8">
            {products.length > 0 ? (
              // Check if this is a main category (has categoryId but no subCategoryId in products)
              // If it's a main category, use old grid layout. If sub-category, use new layout.
              (() => {
                const isMainCategory = products.some(p => !p.subCategoryId);
                const isSubCategory = products.some(p => p.subCategoryId);
                
                if (isMainCategory && !isSubCategory) {
                  // Special case for "Phụ phẩm" category - use variant layout
                  if (category.slug === 'phu-pham') {
                    return (
                      <>
                        {/* Contact Info */}
                        <div className="bg-primary/10 p-4 rounded-lg mb-6 lg:mb-8">
                          <div className="text-black text-base md:text-lg font-semibold">
                            {t('contact.contactLabel')} <br />
                            <span className="text-primary">{t('contact.hotline')}</span>
                          </div>
                        </div>

                        {/* Main Product Image + Variants */}
                        <div className="mb-6 lg:mb-8">
                          <div className="max-w-4xl mx-auto lg:max-w-5xl lg:flex lg:items-start lg:gap-4">
                            {/* Main image (Ô đen) */}
                            <div className="relative rounded-xl shadow-lg overflow-hidden aspect-[3/2] bg-white mb-3 border border-gray-200 flex-1 lg:mb-0">
                              {selectedProduct?.images?.[selectedImageIndex] ? (
                                <img
                                  src={selectedProduct.images[selectedImageIndex]}
                                  alt={typeof selectedProduct.name === 'object' ? (selectedProduct.name[language] || selectedProduct.name.vi) : selectedProduct.name}
                                  className="absolute inset-0 w-full h-full object-contain p-6"
                                  onError={(e) => {
                                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='450' viewBox='0 0 800 450'%3E%3Crect width='800' height='450' fill='%23f3f4f6'/%3E%3Ctext x='400' y='230' text-anchor='middle' fill='%236b7280' font-size='18'%3ENo Image%3C/text%3E%3C/svg%3E";
                                  }}
                                />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-gray-500">{language === 'vi' ? 'Không có hình ảnh' : 'No image'}</div>
                              )}
                            </div>

                            {/* Right-side vertical thumbnails on desktop */}
                            {selectedProduct?.images && selectedProduct.images.length > 1 && (
                              <div className="hidden lg:block">
                                <div className="flex flex-col gap-3 overflow-y-auto max-h-[420px] pr-1">
                                  {selectedProduct.images.map((img, idx) => (
                                    <button
                                      key={idx}
                                      onClick={() => setSelectedImageIndex(idx)}
                                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${idx === selectedImageIndex ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200 hover:border-primary/50'}`}
                                    >
                                      <img src={img} alt={`thumb-${idx+1}`} className="w-full h-full object-cover" />
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Bottom horizontal thumbnails on mobile */}
                          {selectedProduct?.images && selectedProduct.images.length > 1 && (
                            <div className="max-w-4xl mx-auto mb-6 lg:hidden">
                              <div className="flex gap-3 overflow-x-auto pb-2">
                                {selectedProduct.images.map((img, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => setSelectedImageIndex(idx)}
                                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${idx === selectedImageIndex ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200 hover:border-primary/50'}`}
                                  >
                                    <img src={img} alt={`thumb-${idx+1}`} className="w-full h-full object-cover" />
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Thumbnails of variants */}
                          {products.length > 1 && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 max-w-5xl mx-auto lg:mt-4">
                              {products.map((product) => {
                                const productName = typeof product.name === 'object' ? (product.name[language] || product.name.vi) : product.name;
                                const activeClass = product.id === selectedProduct?.id ? 'ring-4 ring-primary shadow-lg scale-105' : 'ring-2 ring-gray-200 hover:ring-primary/50';
                                return (
                                  <button
                                    key={product.id}
                                    type="button"
                                    onClick={() => { setSelectedProduct(product); setSelectedImageIndex(0); }}
                                    className={`text-left rounded-xl overflow-hidden bg-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 ${activeClass}`}
                                    title={productName}
                                  >
                                    <div className="relative w-full aspect-[4/3] bg-gray-50">
                                      {product.images?.[0] ? (
                                        <img src={product.images[0]} alt={productName} className="absolute inset-0 w-full h-full object-contain p-2" />
                                      ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">No image</div>
                                      )}
                                    </div>
                                    <div className="p-3 text-sm font-semibold text-center line-clamp-2 min-h-[3.5rem] flex items-center justify-center">
                                      {productName}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Product Description */}
                        {selectedProduct && (
                          <div className="mb-8 bg-gray-50 rounded-xl p-6">
                            {/* <h2 className="text-black text-xl md:text-2xl font-bold mb-4">{language === 'vi' ? 'Mô tả sản phẩm' : 'Product Description'}</h2> */}
                            <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                              {typeof selectedProduct.description === 'object' 
                                ? (selectedProduct.description[language] || selectedProduct.description.vi)
                                : selectedProduct.description
                              }
                            </p>
                          </div>
                        )}

                        {/* Contact CTA */}
                        <div className="bg-primary text-white p-6 lg:p-8 rounded-lg">
                          <h3 className="text-lg md:text-xl font-bold mb-3">{t('productDetail.contactToOrder')}</h3>
                          <p className="mb-4 text-sm md:text-base leading-relaxed">
                            {t('productDetail.contactDescription')}
                          </p>
                          <div className="text-base md:text-lg font-semibold">
                            {t('contact.hotline')}
                          </div>
                        </div>
                      </>
                    );
                  } else {
                    // Other main categories - use old grid layout
                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
                      {products.map((product) => (
                        <div key={product.id} className="w-full max-w-sm mx-auto lg:max-w-none transform hover:scale-105 transition-transform duration-300">
                          <ProductCard product={product} category={category} />
                        </div>
                      ))}
                    </div>
                  );
                  }
                } else if (category.slug === 'cha-ca') {
                  // Special case for Chả cá - use variant layout
                  return (
                    <>
                      {/* Contact Info */}
                      <div className="bg-primary/10 p-4 rounded-lg mb-6 lg:mb-8">
                        <div className="text-black text-base md:text-lg font-semibold">
                          {t('contact.contactLabel')} <br />
                          <span className="text-primary">{t('contact.hotline')}</span>
                        </div>
                      </div>

                      {/* Main Product Image + Variants */}
                      <div className="mb-6 lg:mb-8">
                        <div className="max-w-4xl mx-auto lg:max-w-5xl lg:flex lg:items-start lg:gap-4">
                          {/* Main image (Ô đen) */}
                          <div className="relative rounded-xl shadow-lg overflow-hidden aspect-[3/2] bg-white mb-3 border border-gray-200 flex-1 lg:mb-0">
                            {selectedProduct?.images?.[selectedImageIndex] ? (
                              <img
                                src={selectedProduct.images[selectedImageIndex]}
                                alt={typeof selectedProduct.name === 'object' ? (selectedProduct.name[language] || selectedProduct.name.vi) : selectedProduct.name}
                                className="absolute inset-0 w-full h-full object-contain p-6"
                                onError={(e) => {
                                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='450' viewBox='0 0 800 450'%3E%3Crect width='800' height='450' fill='%23f3f4f6'/%3E%3Ctext x='400' y='230' text-anchor='middle' fill='%236b7280' font-size='18'%3ENo Image%3C/text%3E%3C/svg%3E";
                                }}
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center text-gray-500">{language === 'vi' ? 'Không có hình ảnh' : 'No image'}</div>
                            )}
                          </div>

                          {/* Right-side vertical thumbnails on desktop */}
                          {selectedProduct?.images && selectedProduct.images.length > 1 && (
                            <div className="hidden lg:block">
                              <div className="flex flex-col gap-3 overflow-y-auto max-h-[420px] pr-1">
                                {selectedProduct.images.map((img, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => setSelectedImageIndex(idx)}
                                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${idx === selectedImageIndex ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200 hover:border-primary/50'}`}
                                  >
                                    <img src={img} alt={`thumb-${idx+1}`} className="w-full h-full object-cover" />
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Bottom horizontal thumbnails on mobile */}
                        {selectedProduct?.images && selectedProduct.images.length > 1 && (
                          <div className="max-w-4xl mx-auto mb-6 lg:hidden">
                            <div className="flex gap-3 overflow-x-auto pb-2">
                              {selectedProduct.images.map((img, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => setSelectedImageIndex(idx)}
                                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${idx === selectedImageIndex ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200 hover:border-primary/50'}`}
                                >
                                  <img src={img} alt={`thumb-${idx+1}`} className="w-full h-full object-cover" />
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Thumbnails of variants */}
                        {products.length > 1 && (
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 max-w-5xl mx-auto lg:mt-4">
                            {products.map((product) => {
                              const productName = typeof product.name === 'object' ? (product.name[language] || product.name.vi) : product.name;
                              const activeClass = product.id === selectedProduct?.id ? 'ring-4 ring-primary shadow-lg scale-105' : 'ring-2 ring-gray-200 hover:ring-primary/50';
                              return (
                                <button
                                  key={product.id}
                                  type="button"
                                  onClick={() => { setSelectedProduct(product); setSelectedImageIndex(0); }}
                                  className={`text-left rounded-xl overflow-hidden bg-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 ${activeClass}`}
                                  title={productName}
                                >
                                  <div className="relative w-full aspect-[4/3] bg-gray-50">
                                    {product.images?.[0] ? (
                                      <img src={product.images[0]} alt={productName} className="absolute inset-0 w-full h-full object-contain p-2" />
                                    ) : (
                                      <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">No image</div>
                                    )}
                                  </div>
                                  <div className="p-3 text-sm font-semibold text-center line-clamp-2 min-h-[3.5rem] flex items-center justify-center">
                                    {productName}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Product Description */}
                      {selectedProduct && (
                        <div className="mb-8 bg-gray-50 rounded-xl p-6">
                          {/* <h2 className="text-black text-xl md:text-2xl font-bold mb-4">{language === 'vi' ? 'Mô tả sản phẩm' : 'Product Description'}</h2> */}
                          <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                            {typeof selectedProduct.description === 'object' 
                              ? (selectedProduct.description[language] || selectedProduct.description.vi)
                              : selectedProduct.description
                            }
                          </p>
                        </div>
                      )}

                      {/* Contact CTA */}
                      <div className="bg-primary text-white p-6 lg:p-8 rounded-lg">
                        <h3 className="text-lg md:text-xl font-bold mb-3">{t('productDetail.contactToOrder')}</h3>
                        <p className="mb-4 text-sm md:text-base leading-relaxed">
                          {t('productDetail.contactDescription')}
                        </p>
                        <div className="text-base md:text-lg font-semibold">
                          {t('contact.hotline')}
                        </div>
                    </div>
                    </>
                  );
                } else {
                  // Sub-category - use new layout with variants
                  return (
                    <>
                      {/* Contact Info */}
                      <div className="bg-primary/10 p-4 rounded-lg mb-6 lg:mb-8">
                        <div className="text-black text-base md:text-lg font-semibold">
                          {t('contact.contactLabel')} <br />
                          <span className="text-primary">{t('contact.hotline')}</span>
                        </div>
                      </div>

                      {/* Main Product Image + Variants */}
                      <div className="mb-6 lg:mb-8">
                        <div className="max-w-4xl mx-auto lg:max-w-5xl lg:flex lg:items-start lg:gap-4">
                          {/* Main image (Ô đen) */}
                          <div className="relative rounded-xl shadow-lg overflow-hidden aspect-[3/2] bg-white mb-3 border border-gray-200 flex-1 lg:mb-0">
                            {selectedProduct?.images?.[selectedImageIndex] ? (
                              <img
                                src={selectedProduct.images[selectedImageIndex]}
                                alt={typeof selectedProduct.name === 'object' ? (selectedProduct.name[language] || selectedProduct.name.vi) : selectedProduct.name}
                                className="absolute inset-0 w-full h-full object-contain p-6"
                                onError={(e) => {
                                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='450' viewBox='0 0 800 450'%3E%3Crect width='800' height='450' fill='%23f3f4f6'/%3E%3Ctext x='400' y='230' text-anchor='middle' fill='%236b7280' font-size='18'%3ENo Image%3C/text%3E%3C/svg%3E";
                                }}
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center text-gray-500">{language === 'vi' ? 'Không có hình ảnh' : 'No image'}</div>
                            )}
                          </div>

                          {/* Right-side vertical thumbnails on desktop */}
                          {selectedProduct?.images && selectedProduct.images.length > 1 && (
                            <div className="hidden lg:block">
                              <div className="flex flex-col gap-3 overflow-y-auto max-h-[420px] pr-1">
                                {selectedProduct.images.map((img, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => setSelectedImageIndex(idx)}
                                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${idx === selectedImageIndex ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200 hover:border-primary/50'}`}
                                  >
                                    <img src={img} alt={`thumb-${idx+1}`} className="w-full h-full object-cover" />
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Bottom horizontal thumbnails on mobile */}
                        {selectedProduct?.images && selectedProduct.images.length > 1 && (
                          <div className="max-w-4xl mx-auto mb-6 lg:hidden">
                            <div className="flex gap-3 overflow-x-auto pb-2">
                              {selectedProduct.images.map((img, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => setSelectedImageIndex(idx)}
                                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${idx === selectedImageIndex ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200 hover:border-primary/50'}`}
                                >
                                  <img src={img} alt={`thumb-${idx+1}`} className="w-full h-full object-cover" />
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Thumbnails of variants */}
                        {products.length > 1 && (
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 max-w-5xl mx-auto lg:mt-4">
                            {products.map((product) => {
                              const productName = typeof product.name === 'object' ? (product.name[language] || product.name.vi) : product.name;
                              const activeClass = product.id === selectedProduct?.id ? 'ring-4 ring-primary shadow-lg scale-105' : 'ring-2 ring-gray-200 hover:ring-primary/50';
                              return (
                                <button
                                  key={product.id}
                                  type="button"
                                  onClick={() => { setSelectedProduct(product); setSelectedImageIndex(0); }}
                                  className={`text-left rounded-xl overflow-hidden bg-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 ${activeClass}`}
                                  title={productName}
                                >
                                  <div className="relative w-full aspect-[4/3] bg-gray-50">
                                    {product.images?.[0] ? (
                                      <img src={product.images[0]} alt={productName} className="absolute inset-0 w-full h-full object-contain p-2" />
                                    ) : (
                                      <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">No image</div>
                                    )}
                                  </div>
                                  <div className="p-3 text-sm font-semibold text-center line-clamp-2 min-h-[3.5rem] flex items-center justify-center">
                                    {productName}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Product Description */}
                      {selectedProduct && (
                        <div className="mb-8 bg-gray-50 rounded-xl p-6">
                          {/* <h2 className="text-black text-xl md:text-2xl font-bold mb-4">{language === 'vi' ? 'Mô tả sản phẩm' : 'Product Description'}</h2> */}
                          <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                            {typeof selectedProduct.description === 'object' 
                              ? (selectedProduct.description[language] || selectedProduct.description.vi)
                              : selectedProduct.description
                            }
                          </p>
                        </div>
                      )}

                      {/* Contact CTA */}
                      <div className="bg-primary text-white p-6 lg:p-8 rounded-lg">
                        <h3 className="text-lg md:text-xl font-bold mb-3">{t('productDetail.contactToOrder')}</h3>
                        <p className="mb-4 text-sm md:text-base leading-relaxed">
                          {t('productDetail.contactDescription')}
                        </p>
                        <div className="text-base md:text-lg font-semibold">
                          {t('contact.hotline')}
                        </div>
                      </div>
                    </>
                  );
                }
              })()
            ) : (
              <div className="text-center py-20">
                <div className="mb-6">
                  <svg className="w-24 h-24 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v+5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <div className="text-lg md:text-xl text-gray-500 mb-2">
                  {language === 'vi' ? 'Không có sản phẩm nào trong danh mục này' : 'No products found in this category'}
                </div>
                <div className="text-sm text-gray-400">
                  {language === 'vi' ? 'Vui lòng quay lại sau hoặc liên hệ với chúng tôi' : 'Please check back later or contact us'}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
