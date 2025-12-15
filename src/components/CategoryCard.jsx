import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../utils/LanguageContext';

const CategoryCard = ({ category, productCount = 0 }) => {
  const { language } = useLanguage();
  
  const getCategoryName = () => {
    if (typeof category.name === 'object') {
      return category.name[language] || category.name.vi;
    }
    return category.name;
  };

  const targetHref = (() => {
    // If sub-category Cá Basa, go straight to main variant detail
    if (category?.slug === 'ca-basa') return '/product/ca-basa-nguyen-con';
    return `/category/${category.slug}`;
  })();

  return (
    <Link 
      to={targetHref}
      className="block w-full relative overflow-hidden rounded-xl shadow-md hover:shadow-2xl transition-all duration-500 group aspect-[16/9] bg-sky-50 max-w-[560px] mx-auto border border-sky-100"
    >
      <img
        src={category.image || '/images/placeholder-category.jpg'}
        alt={getCategoryName()}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        loading="lazy"
        onError={(e) => {
          e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='200' y='160' text-anchor='middle' fill='%236b7280' font-size='16'%3ENo Image%3C/text%3E%3C/svg%3E";
        }}
      />
      
      {/* Overlay gradient tuned to ocean tone instead of pure black */}
      <div className="absolute inset-0 bg-gradient-to-t from-sky-950/90 via-sky-900/40 to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Content overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-sky-950 via-sky-900/90 to-transparent p-3 sm:p-4 md:p-5">
        <h3 className="text-white font-bold text-base sm:text-lg md:text-xl lg:text-xl mb-2 leading-tight">
          {getCategoryName()}
        </h3>
        {productCount > 0 && (
          <div className="flex justify-between items-center">
            <p className="text-white/90 text-xs sm:text-sm md:text-base font-medium">
              {productCount} {language === 'vi' ? 'sản phẩm' : 'products'}
            </p>
            <div className="bg-primary/90 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-semibold">
              {language === 'vi' ? 'Khám phá' : 'Explore'}
            </div>
          </div>
        )}
      </div>
      
      {/* Category badge */}
      <div className="absolute top-4 left-4">
        <div className="bg-primary/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
          {language === 'vi' ? 'Danh mục' : 'Category'}
        </div>
      </div>
      
      {/* Hover indicator */}
      <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </div>
    </Link>
  );
};

export default CategoryCard;
