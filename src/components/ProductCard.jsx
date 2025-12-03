import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../utils/LanguageContext';

const ProductCard = ({ product, category }) => {
  const { language } = useLanguage();
  
  const getProductName = () => {
    if (typeof product.name === 'object') {
      return product.name[language] || product.name.vi;
    }
    return product.name;
  };
  
  const getCategoryName = () => {
    if (category && typeof category.name === 'object') {
      return category.name[language] || category.name.vi;
    }
    return category?.name;
  };

  return (
    <Link 
      to={`/product/${product.slug}`}
      className="block w-full relative overflow-hidden rounded-xl shadow-md hover:shadow-2xl transition-all duration-500 group aspect-[16/9] bg-white"
    >
      <img
        src={product.images?.[0] || '/images/placeholder-product.jpg'}
        alt={getProductName()}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        loading="lazy"
        onError={(e) => {
          e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='200' y='160' text-anchor='middle' fill='%236b7280' font-size='16'%3ENo Image%3C/text%3E%3C/svg%3E";
        }}
      />
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Content overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 sm:p-4 lg:p-6">
        <h3 className="text-white font-bold text-sm sm:text-base md:text-lg lg:text-xl mb-2 line-clamp-2 leading-tight">
          {getProductName()}
        </h3>
        {category && (
          <div className="flex justify-between items-center">
            <p className="text-white/90 text-xs sm:text-sm md:text-base font-medium">{getCategoryName()}</p>
            <div className="bg-primary/90 text-white px-2 py-1 rounded-full text-xs font-semibold">
              {language === 'vi' ? 'Xem' : 'View'}
            </div>
          </div>
        )}
      </div>
      
      {/* Hover indicator */}
      <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      </div>
    </Link>
  );
};

export default ProductCard;
