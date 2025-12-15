import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../utils/LanguageContext';
import { loadData } from '../utils/helpers';
import CategoryCard from '../components/CategoryCard';
import SEO from '../components/SEO';

const Homepage = () => {
  const { t, language } = useLanguage();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesData = await loadData('categories.json');
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading homepage data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Wizus Food",
    "description": t('hero.description'),
    "url": window.location.origin,
    "logo": `${window.location.origin}/images/logo.png`,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+84987055245",
      "contactType": "Customer Service"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "VN",
      "addressRegion": "Cần Thơ",
      "addressLocality": "Cần Thơ"
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <div className="text-lg lg:text-xl text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white">
      <SEO
        title={t('nav.home')}
        description={t('hero.description')}
        keywords="cá tra, cá nước ngọt, chả cá, nông sản, thực phẩm đông lạnh, Wizus Food"
        structuredData={structuredData}
      />
      
      <div className="bg-white">
        {/* Hero Section spacer removed to bring banner close to header */}
        <div className="h-2 lg:h-3"></div>
        
        {/* Hero Banner - tuned for stronger seafood branding */}
        <div className="w-full relative overflow-hidden mb-8 lg:mb-16 bg-gradient-to-b from-sky-50 to-white">
          <img
            src="/images/banner.png"
            alt={t('hero.companyName')}
            className="block w-full h-auto object-cover md:object-contain brightness-110"
            loading="lazy"
          />

          {/* Overlay with subtle ocean-tone gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-sky-900/70 via-sky-900/40 to-transparent flex items-center justify-center">
            <div className="text-center px-4 relative z-10 space-y-3 md:space-y-4">
              <span className="inline-flex items-center rounded-full bg-white/15 border border-sky-200/60 px-4 py-1 text-xs md:text-sm font-semibold tracking-wide text-sky-50 backdrop-blur-md">
                {language === 'vi'
                  ? 'Pangasius & Thủy sản nước ngọt xuất khẩu'
                  : 'Pangasius & Freshwater Seafood Exporter'}
              </span>
              <h1 className="text-white text-2xl md:text-4xl lg:text-5xl font-bold mb-1 md:mb-2 drop-shadow-lg">
                {t('hero.companyName')}
              </h1>
              <p className="max-w-2xl mx-auto text-sky-100 text-sm md:text-base lg:text-lg leading-relaxed font-medium drop-shadow">
                {t('hero.description')}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-8 lg:mb-16">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto">
            <Link 
              to="/search"
              className="w-full sm:flex-1 bg-primary py-3 sm:py-4 md:py-5 rounded-xl hover:bg-primary-dark transition-all duration-300 text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1 group"
            >
              <span className="text-white text-base sm:text-lg md:text-xl lg:text-2xl font-bold flex items-center justify-center gap-2 sm:gap-3">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {t('hero.searchProducts')}
              </span>
            </Link>
            <Link 
              to="/contact"
              className="w-full sm:flex-1 py-3 sm:py-4 md:py-5 rounded-xl border-2 border-primary hover:bg-primary hover:text-white transition-all duration-300 text-center group shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <span className="text-primary group-hover:text-white text-base sm:text-lg md:text-xl lg:text-2xl font-bold flex items-center justify-center gap-2 sm:gap-3">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {t('hero.contactUs')}
              </span>
            </Link>
          </div>
        </div>

        {/* Company Branding Section */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-10 lg:mb-16">
          <div className="text-center">
            {/* Company Name with gradient */}
            <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary via-blue-600 to-primary bg-clip-text text-transparent">
              {t('hero.companyName')}
            </h2>
            
            {/* Decorative elements */}
            <div className="flex items-center justify-center mb-4 sm:mb-6">
              <div className="hidden sm:block w-12 sm:w-16 lg:w-24 h-1 bg-gradient-to-r from-transparent to-primary rounded-full"></div>
              <div className="mx-3 sm:mx-4 lg:mx-8">
                <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl px-5 sm:px-6 py-2.5 sm:py-3.5 lg:px-10 lg:py-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <span className="text-white font-bold text-base sm:text-lg md:text-xl lg:text-2xl tracking-wide">WIZUS FOOD</span>
                </div>
              </div>
              <div className="hidden sm:block w-12 sm:w-16 lg:w-24 h-1 bg-gradient-to-l from-transparent to-primary rounded-full"></div>
            </div>
            
            {/* Company Description with better styling */}
            <div className="max-w-4xl mx-auto px-2">
              <p className="text-gray-700 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed font-medium">
                {t('hero.description')}
              </p>
            </div>
          </div>
        </div>

        {/* Product Categories Section */}
        <div className="container mx-auto px-4 lg:px-8 mb-8 lg:mb-16">
          <div className="text-center mb-8 lg:mb-12">
            <h3 className="text-black text-2xl md:text-3xl lg:text-4xl font-bold">
              {t('products.categories')}
            </h3>
          </div>

          {/* Categories Grid - Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 sm:gap-8 lg:gap-10 justify-items-center">
            {categories.map((category, index) => (
              <div key={category.id} className="w-full max-w-sm transform hover:scale-105 transition-transform duration-300">
                <CategoryCard category={category} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
