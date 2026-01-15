import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from '../utils/LanguageContext';
import { loadData, setPageTitle, setPageMeta } from '../utils/helpers';
import Breadcrumb from '../components/Breadcrumb';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const { t, language } = useLanguage();
  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          loadData('products.json'),
          loadData('categories.json')
        ]);

        // Find product by slug
        const foundProduct = productsData.find(prod => prod.slug === slug);
        
        if (foundProduct) {
          setProduct(foundProduct);
          
          // Check if current product is a by-product
          const productName = typeof foundProduct.name === 'object' ? foundProduct.name.vi : foundProduct.name;
          const isByProduct = productName.includes('Da cá') || productName.includes('Bao tử') || productName.includes('Vảy cá');
          
          // Build variants by subCategoryId (e.g., Cá Basa variants)
          if (foundProduct.subCategoryId) {
            const siblings = productsData.filter(p => p.subCategoryId === foundProduct.subCategoryId);
            
            if (isByProduct) {
              // If current product is a by-product, show only by-products as variants
              const byProducts = siblings.filter(p => {
                const name = typeof p.name === 'object' ? p.name.vi : p.name;
                return name.includes('Da cá') || name.includes('Bao tử') || name.includes('Vảy cá');
              });
              setVariants(byProducts);
              setSelectedProduct(foundProduct); // Keep the clicked by-product as main
            } else {
              // If current product is main product, prioritize main products for display
              const mainProducts = siblings.filter(p => {
                const name = typeof p.name === 'object' ? p.name.vi : p.name;
                return !name.includes('Da cá') && !name.includes('Bao tử') && !name.includes('Vảy cá');
              });
              const preferred = mainProducts.find(p => p.slug === 'ca-basa-nguyen-con') || 
                               mainProducts.find(p => p.slug === 'ca-tra-phi-le') ||
                               mainProducts.find(p => p.slug === 'ca-tra-nguyen-con-dong-lanh') ||
                               mainProducts[0] || foundProduct;
              setVariants(siblings);
              setSelectedProduct(preferred);
            }
          } else {
            // Fallback for generic entries
            // 1) Cá Basa: group all basa variants by shared subCategoryId
            const basaSubCategoryId = '000000-000000-00000-00001-000000000017';
            const basaWhole = productsData.find(p => p.subCategoryId === basaSubCategoryId);
            if (foundProduct.slug === 'ca-basa' && basaWhole?.subCategoryId) {
              const siblings = productsData.filter(p => p.subCategoryId === basaWhole.subCategoryId);
              
              if (isByProduct) {
                // If current product is a by-product, show only by-products as variants
                const byProducts = siblings.filter(p => {
                  const name = typeof p.name === 'object' ? p.name.vi : p.name;
                  return name.includes('Da cá') || name.includes('Bao tử') || name.includes('Vảy cá');
                });
                setVariants(byProducts);
                setSelectedProduct(foundProduct);
              } else {
                // Prioritize main products over by-products
                const mainProducts = siblings.filter(p => {
                  const name = typeof p.name === 'object' ? p.name.vi : p.name;
                  return !name.includes('Da cá') && !name.includes('Bao tử') && !name.includes('Vảy cá');
                });
                const preferred = mainProducts.find(p => p.slug === 'ca-basa-nguyen-con') || mainProducts[0] || foundProduct;
                setVariants(siblings);
                setSelectedProduct(preferred);
              }
            } else if (foundProduct.slug === 'ca-tra') {
              // 2) Cá Tra: use subCategoryId from a known variant (phi lê), augment with skin and stomach items if present
              const traFillet = productsData.find(p => p.slug === 'ca-tra-phi-le' && p.subCategoryId);
              if (traFillet?.subCategoryId) {
                const siblings = productsData.filter(p => p.subCategoryId === traFillet.subCategoryId);
                const extras = ['da-ca-tra-dong-lanh', 'bao-tu-ca-tra']
                  .map(slug => productsData.find(p => p.slug === slug))
                  .filter(Boolean);
                const uniqueById = new Map();
                [...siblings, ...extras].forEach(item => uniqueById.set(item.id, item));
                const allVariants = Array.from(uniqueById.values());
                
                if (isByProduct) {
                  // If current product is a by-product, show only by-products as variants
                  const byProducts = allVariants.filter(p => {
                    const name = typeof p.name === 'object' ? p.name.vi : p.name;
                    return name.includes('Da cá') || name.includes('Bao tử') || name.includes('Vảy cá');
                  });
                  setVariants(byProducts);
                  setSelectedProduct(foundProduct);
                } else {
                  // Prioritize main products over by-products
                  const mainProducts = allVariants.filter(p => {
                    const name = typeof p.name === 'object' ? p.name.vi : p.name;
                    return !name.includes('Da cá') && !name.includes('Bao tử') && !name.includes('Vảy cá');
                  });
                  const preferred = mainProducts.find(p => p.slug === 'ca-tra-phi-le') || 
                                   mainProducts.find(p => p.slug === 'ca-tra-nguyen-con-dong-lanh') ||
                                   mainProducts[0] || foundProduct;
                  setVariants(allVariants);
                  setSelectedProduct(preferred);
                }
              } else {
                setVariants([]);
                setSelectedProduct(foundProduct);
              }
            } else if (foundProduct.slug === 'ca-ro-phi') {
              // 3) Cá Rô phi: find variants by name pattern
              const roPhiVariants = productsData.filter(p => {
                const name = typeof p.name === 'object' ? p.name.vi : p.name;
                return name && name.includes('Cá rô phi') && p.slug !== 'ca-ro-phi';
              });
              if (roPhiVariants.length > 0) {
                if (isByProduct) {
                  // If current product is a by-product, show only by-products as variants
                  const byProducts = roPhiVariants.filter(p => {
                    const name = typeof p.name === 'object' ? p.name.vi : p.name;
                    return name.includes('Da cá') || name.includes('Bao tử') || name.includes('Vảy cá');
                  });
                  setVariants(byProducts);
                  setSelectedProduct(foundProduct);
                } else {
                  // Prioritize main products over by-products
                  const mainProducts = roPhiVariants.filter(p => {
                    const name = typeof p.name === 'object' ? p.name.vi : p.name;
                    return !name.includes('Da cá') && !name.includes('Bao tử') && !name.includes('Vảy cá');
                  });
                  const preferred = mainProducts.find(p => p.slug === 'ca-ro-phi-phi-le') || 
                                   mainProducts.find(p => p.slug === 'ca-ro-phi-nguyen-con-dong-lanh') ||
                                   mainProducts[0] || foundProduct;
                  setVariants(roPhiVariants);
                  setSelectedProduct(preferred);
                }
              } else {
                setVariants([]);
                setSelectedProduct(foundProduct);
              }
            } else if (foundProduct.slug === 'ca-ro') {
              // 4) Cá Rô: find variants by name pattern (exclude "Cá rô phi" products)
              const roVariants = productsData.filter(p => {
                const name = typeof p.name === 'object' ? p.name.vi : p.name;
                return name && name.includes('Cá rô') && !name.includes('Cá rô phi') && p.slug !== 'ca-ro';
              });
              if (roVariants.length > 0) {
                if (isByProduct) {
                  // If current product is a by-product, show only by-products as variants
                  const byProducts = roVariants.filter(p => {
                    const name = typeof p.name === 'object' ? p.name.vi : p.name;
                    return name.includes('Da cá') || name.includes('Bao tử') || name.includes('Vảy cá');
                  });
                  setVariants(byProducts);
                  setSelectedProduct(foundProduct);
                } else {
                  // Prioritize main products over by-products
                  const mainProducts = roVariants.filter(p => {
                    const name = typeof p.name === 'object' ? p.name.vi : p.name;
                    return !name.includes('Da cá') && !name.includes('Bao tử') && !name.includes('Vảy cá');
                  });
                  const preferred = mainProducts.find(p => p.slug === 'ca-ro-lam-sach') || mainProducts[0] || foundProduct;
                  setVariants(roVariants);
                  setSelectedProduct(preferred);
                }
              } else {
                setVariants([]);
                setSelectedProduct(foundProduct);
              }
            } else if (foundProduct.slug === 'hen') {
              // 5) Hến: find variants by name pattern
              const henVariants = productsData.filter(p => {
                const name = typeof p.name === 'object' ? p.name.vi : p.name;
                return name && name.includes('Hến') && p.slug !== 'hen';
              });
              if (henVariants.length > 0) {
                if (isByProduct) {
                  // If current product is a by-product, show only by-products as variants
                  const byProducts = henVariants.filter(p => {
                    const name = typeof p.name === 'object' ? p.name.vi : p.name;
                    return name.includes('Da cá') || name.includes('Bao tử') || name.includes('Vảy cá');
                  });
                  setVariants(byProducts);
                  setSelectedProduct(foundProduct);
                } else {
                  // Prioritize main products over by-products
                  const mainProducts = henVariants.filter(p => {
                    const name = typeof p.name === 'object' ? p.name.vi : p.name;
                    return !name.includes('Da cá') && !name.includes('Bao tử') && !name.includes('Vảy cá');
                  });
                  const preferred = mainProducts.find(p => p.slug === 'thit-hen-dong-lanh') || mainProducts[0] || foundProduct;
                  setVariants(henVariants);
                  setSelectedProduct(preferred);
                }
              } else {
                setVariants([]);
                setSelectedProduct(foundProduct);
              }
            } else if (foundProduct.slug === 'luon') {
              // 6) Lươn: find variants by name pattern
              const luonVariants = productsData.filter(p => {
                const name = typeof p.name === 'object' ? p.name.vi : p.name;
                return name && name.includes('Lươn') && p.slug !== 'luon';
              });
              if (luonVariants.length > 0) {
                if (isByProduct) {
                  // If current product is a by-product, show only by-products as variants
                  const byProducts = luonVariants.filter(p => {
                    const name = typeof p.name === 'object' ? p.name.vi : p.name;
                    return name.includes('Da cá') || name.includes('Bao tử') || name.includes('Vảy cá');
                  });
                  setVariants(byProducts);
                  setSelectedProduct(foundProduct);
                } else {
                  // Prioritize main products over by-products
                  const mainProducts = luonVariants.filter(p => {
                    const name = typeof p.name === 'object' ? p.name.vi : p.name;
                    return !name.includes('Da cá') && !name.includes('Bao tử') && !name.includes('Vảy cá');
                  });
                  const preferred = mainProducts.find(p => p.slug === 'luon-dong-lanh') || mainProducts[0] || foundProduct;
                  setVariants(luonVariants);
                  setSelectedProduct(preferred);
                }
              } else {
                setVariants([]);
                setSelectedProduct(foundProduct);
              }
            } else if (foundProduct.slug === 'ca-troi') {
              // 7) Cá Trôi: find variants by name pattern
              const troiVariants = productsData.filter(p => {
                const name = typeof p.name === 'object' ? p.name.vi : p.name;
                return name && name.includes('Cá trôi') && p.slug !== 'ca-troi';
              });
              if (troiVariants.length > 0) {
                if (isByProduct) {
                  // If current product is a by-product, show only by-products as variants
                  const byProducts = troiVariants.filter(p => {
                    const name = typeof p.name === 'object' ? p.name.vi : p.name;
                    return name.includes('Da cá') || name.includes('Bao tử') || name.includes('Vảy cá');
                  });
                  setVariants(byProducts);
                  setSelectedProduct(foundProduct);
                } else {
                  // Prioritize main products over by-products
                  const mainProducts = troiVariants.filter(p => {
                    const name = typeof p.name === 'object' ? p.name.vi : p.name;
                    return !name.includes('Da cá') && !name.includes('Bao tử') && !name.includes('Vảy cá');
                  });
                  const preferred = mainProducts.find(p => p.slug === 'ca-troi-dong-lanh') || mainProducts[0] || foundProduct;
                  setVariants(troiVariants);
                  setSelectedProduct(preferred);
                }
              } else {
                setVariants([]);
                setSelectedProduct(foundProduct);
              }
            } else if (foundProduct.slug === 'ca-chim') {
              // 8) Cá Chim: find variants by name pattern
              const chimVariants = productsData.filter(p => {
                const name = typeof p.name === 'object' ? p.name.vi : p.name;
                return name && name.includes('Cá chim') && p.slug !== 'ca-chim';
              });
              if (chimVariants.length > 0) {
                if (isByProduct) {
                  // If current product is a by-product, show only by-products as variants
                  const byProducts = chimVariants.filter(p => {
                    const name = typeof p.name === 'object' ? p.name.vi : p.name;
                    return name.includes('Da cá') || name.includes('Bao tử') || name.includes('Vảy cá');
                  });
                  setVariants(byProducts);
                  setSelectedProduct(foundProduct);
                } else {
                  // Prioritize main products over by-products
                  const mainProducts = chimVariants.filter(p => {
                    const name = typeof p.name === 'object' ? p.name.vi : p.name;
                    return !name.includes('Da cá') && !name.includes('Bao tử') && !name.includes('Vảy cá');
                  });
                  const preferred = mainProducts.find(p => p.slug === 'ca-chim-dong-lanh') || mainProducts[0] || foundProduct;
                  setVariants(chimVariants);
                  setSelectedProduct(preferred);
                }
              } else {
                setVariants([]);
                setSelectedProduct(foundProduct);
              }
            } else if (foundProduct.slug === 'ca-chem') {
              // 9) Cá Chẽm: find variants by name pattern
              const chemVariants = productsData.filter(p => {
                const name = typeof p.name === 'object' ? p.name.vi : p.name;
                return name && name.includes('Cá chẽm') && p.slug !== 'ca-chem';
              });
              if (chemVariants.length > 0) {
                if (isByProduct) {
                  // If current product is a by-product, show only by-products as variants
                  const byProducts = chemVariants.filter(p => {
                    const name = typeof p.name === 'object' ? p.name.vi : p.name;
                    return name.includes('Da cá') || name.includes('Bao tử') || name.includes('Vảy cá');
                  });
                  setVariants(byProducts);
                  setSelectedProduct(foundProduct);
                } else {
                  // Prioritize main products over by-products
                  const mainProducts = chemVariants.filter(p => {
                    const name = typeof p.name === 'object' ? p.name.vi : p.name;
                    return !name.includes('Da cá') && !name.includes('Bao tử') && !name.includes('Vảy cá');
                  });
                  const preferred = mainProducts.find(p => p.slug === 'ca-chem-dong-lanh') || mainProducts[0] || foundProduct;
                  setVariants(chemVariants);
                  setSelectedProduct(preferred);
                }
              } else {
                setVariants([]);
                setSelectedProduct(foundProduct);
              }
            } else if (foundProduct.slug === 'ca-loc') {
              // 10) Cá Lóc: find variants by name pattern
              const locVariants = productsData.filter(p => {
                const name = typeof p.name === 'object' ? p.name.vi : p.name;
                return name && name.includes('Cá lóc') && p.slug !== 'ca-loc';
              });
              if (locVariants.length > 0) {
                if (isByProduct) {
                  // If current product is a by-product, show only by-products as variants
                  const byProducts = locVariants.filter(p => {
                    const name = typeof p.name === 'object' ? p.name.vi : p.name;
                    return name.includes('Da cá') || name.includes('Bao tử') || name.includes('Vảy cá');
                  });
                  setVariants(byProducts);
                  setSelectedProduct(foundProduct);
                } else {
                  // Prioritize main products over by-products
                  const mainProducts = locVariants.filter(p => {
                    const name = typeof p.name === 'object' ? p.name.vi : p.name;
                    return !name.includes('Da cá') && !name.includes('Bao tử') && !name.includes('Vảy cá');
                  });
                  const preferred = mainProducts.find(p => p.slug === 'ca-loc-dong-lanh') || mainProducts[0] || foundProduct;
                  setVariants(locVariants);
                  setSelectedProduct(preferred);
                }
              } else {
                setVariants([]);
                setSelectedProduct(foundProduct);
              }
            } else if (foundProduct.slug === 'ca-tre') {
              // 11) Cá Trê: find variants by name pattern
              const treVariants = productsData.filter(p => {
                const name = typeof p.name === 'object' ? p.name.vi : p.name;
                return name && name.includes('Cá trê') && p.slug !== 'ca-tre';
              });
              if (treVariants.length > 0) {
                if (isByProduct) {
                  // If current product is a by-product, show only by-products as variants
                  const byProducts = treVariants.filter(p => {
                    const name = typeof p.name === 'object' ? p.name.vi : p.name;
                    return name.includes('Da cá') || name.includes('Bao tử') || name.includes('Vảy cá');
                  });
                  setVariants(byProducts);
                  setSelectedProduct(foundProduct);
                } else {
                  // Prioritize main products over by-products
                  const mainProducts = treVariants.filter(p => {
                    const name = typeof p.name === 'object' ? p.name.vi : p.name;
                    return !name.includes('Da cá') && !name.includes('Bao tử') && !name.includes('Vảy cá');
                  });
                  const preferred = mainProducts.find(p => p.slug === 'ca-tre-dong-lanh') || mainProducts[0] || foundProduct;
                  setVariants(treVariants);
                  setSelectedProduct(preferred);
                }
              } else {
                setVariants([]);
                setSelectedProduct(foundProduct);
              }
            } else if (foundProduct.slug === 'ca-that-lat') {
              // 12) Cá Thát lát: find variants by name pattern
              const thatLatVariants = productsData.filter(p => {
                const name = typeof p.name === 'object' ? p.name.vi : p.name;
                return name && (name.includes('Cá thát lát') || name.includes('Chả cá thát lát')) && p.slug !== 'ca-that-lat';
              });
              if (thatLatVariants.length > 0) {
                if (isByProduct) {
                  // If current product is a by-product, show only by-products as variants
                  const byProducts = thatLatVariants.filter(p => {
                    const name = typeof p.name === 'object' ? p.name.vi : p.name;
                    return name.includes('Da cá') || name.includes('Bao tử') || name.includes('Vảy cá');
                  });
                  setVariants(byProducts);
                  setSelectedProduct(foundProduct);
                } else {
                  // Prioritize main products over by-products
                  const mainProducts = thatLatVariants.filter(p => {
                    const name = typeof p.name === 'object' ? p.name.vi : p.name;
                    return !name.includes('Da cá') && !name.includes('Bao tử') && !name.includes('Vảy cá');
                  });
                  const preferred = mainProducts.find(p => p.slug === 'cha-ca-that-lat') || mainProducts[0] || foundProduct;
                  setVariants(thatLatVariants);
                  setSelectedProduct(preferred);
                }
              } else {
                setVariants([]);
                setSelectedProduct(foundProduct);
              }
            } else {
              setVariants([]);
              setSelectedProduct(foundProduct);
            }
          }
          
          // Find category (only main categories)
          const foundCategory = categoriesData.find(cat => cat.id === foundProduct.categoryId);
          setCategory(foundCategory);
        }
      } catch (error) {
        console.error('Error loading product data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  // derive strings inline to avoid missing deps warnings
  const active = selectedProduct || product;
  const derivedProductName = active && typeof active.name === 'object'
    ? (active.name[language] || active.name.vi)
    : active?.name;

  const derivedCategoryName = category && typeof category.name === 'object'
    ? (category.name[language] || category.name.vi)
    : category?.name;

  // Reset image index when product changes
  useEffect(() => {
    setSelectedImageIndex(0);
  }, [active?.id]);

  useEffect(() => {
    if (active) {
      setPageTitle(derivedProductName);
      setPageMeta(`${language === 'vi' ? 'Chi tiết sản phẩm' : 'Product details'} ${derivedProductName}`, derivedProductName);
    }
  }, [active, language, derivedProductName]);

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
    ...(category ? [{ label: derivedCategoryName, to: `/category/${category.slug}` }] : []),
    { label: derivedProductName, to: `/product/${product.slug}` }
  ];

  return (
    <div className="flex flex-col bg-white min-h-screen">
      <div className="container mx-auto px-4 lg:px-8 py-6">
        {/* Breadcrumb */}
        <Breadcrumb customItems={breadcrumbs} />

        {/* Product Title */}
        <h1 className="text-black text-2xl md:text-3xl lg:text-4xl font-bold mb-4 lg:mb-6">
          {derivedProductName}
        </h1>

        {/* Contact Info */}
        <div className="bg-primary/10 p-4 rounded-lg mb-6 lg:mb-8">
          <div className="text-black text-base md:text-lg font-semibold">
            {t('contact.contactLabel')} <br />
            <span className="text-primary">{t('contact.hotline')}</span>
          </div>
        </div>

        {/* Product Image Gallery - Ô đen (trái), Ô vàng + Ô hồng (phải) */}
        <div className="mb-6 lg:mb-8 flex flex-col lg:flex-row gap-6">
          {/* Main Image Display - Ô đen */}
          <div className="flex-1">
            <div className="relative rounded-lg shadow-lg overflow-hidden aspect-[16/9] bg-gray-100">
              {active?.images?.[selectedImageIndex] ? (
                <img
                  src={active.images[selectedImageIndex]}
                  alt={derivedProductName}
                  className="absolute inset-0 w-full h-full object-cover transition-all duration-300"
                  onError={(e) => {
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='450' viewBox='0 0 800 450'%3E%3Crect width='800' height='450' fill='%23f3f4f6'/%3E%3Ctext x='400' y='230' text-anchor='middle' fill='%236b7280' font-size='18'%3ENo Image%3C/text%3E%3C/svg%3E";
                  }}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-xl">
                  {language === 'vi' ? 'Không có hình ảnh' : 'No image'}
                </div>
              )}
              {active?.images && active.images.length > 1 && (
                <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                  {selectedImageIndex + 1} / {active.images.length}
                </div>
              )}
            </div>
          </div>

          {/* Right sidebar: Ô vàng + Ô hồng */}
          <aside className="w-full lg:w-80 xl:w-96 space-y-6">
            {/* Image Thumbnails - Ô vàng */}
            {active?.images && active.images.length > 1 && (
              <div>
                <h3 className="text-base font-semibold mb-2 text-gray-700">
                  {language === 'vi' ? 'Hình ảnh sản phẩm' : 'Product Images'}
                </h3>
                <div className="flex flex-col gap-3 max-h-96 overflow-auto pr-1">
                  {active.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-1/2 self-start rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        index === selectedImageIndex ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200 hover:border-primary/50'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${derivedProductName} ${index + 1}`}
                        className="w-full h-20 object-cover"
                        onError={(e) => {
                          e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%23f3f4f6'/%3E%3Ctext x='40' y='45' text-anchor='middle' fill='%236b7280' font-size='10'%3ENo Image%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Variants moved below main gallery */}
          </aside>
        </div>

        {/* Product Variants - now below the gallery, full-width */}
        {variants.length > 1 && (
          <div className="mb-8">
            <div className="max-w-5xl mx-auto">
              <h3 className="text-base font-semibold mb-3 text-gray-700">
                {language === 'vi' ? 'Các biến thể sản phẩm' : 'Product Variants'}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {variants.map((v) => {
                  const vName = typeof v.name === 'object' ? (v.name[language] || v.name.vi) : v.name;
                  const activeClass = v.id === active?.id ? 'ring-2 ring-primary bg-primary/5' : 'ring-1 ring-gray-200 hover:ring-primary/50';
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => {
                        setSelectedProduct(v);
                        setSelectedImageIndex(0);
                      }}
                      className={`text-left rounded-lg overflow-hidden bg-white shadow hover:shadow-md transition-all duration-200 ${activeClass}`}
                      title={vName}
                    >
                      <div className="relative w-full aspect-[4/3] bg-gray-100">
                        {v.images?.[0] ? (
                          <img src={v.images[0]} alt={vName} className="absolute inset-0 w-full h-full object-cover" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">
                            {language === 'vi' ? 'Không có ảnh' : 'No image'}
                          </div>
                        )}
                      </div>
                      <div className="p-2">
                        <div className="text-xs font-semibold line-clamp-2 text-gray-800">{vName}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Product Price removed by request */}

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
      </div>
    </div>
  );
};

export default ProductDetailPage;
