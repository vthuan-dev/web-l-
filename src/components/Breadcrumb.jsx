import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../utils/LanguageContext';

const Breadcrumb = ({ customItems = [] }) => {
  const { t } = useLanguage();
  const location = useLocation();
  
  // Default breadcrumb items based on current path
  const getDefaultBreadcrumbs = () => {
    const path = location.pathname;
    const items = [{ label: t('breadcrumb.home'), to: '/' }];
    
    if (path.startsWith('/products')) {
      items.push({ label: t('breadcrumb.categories'), to: '/products' });
      
      if (path !== '/products') {
        const segments = path.split('/').filter(Boolean);
        if (segments.length > 1) {
          // This would be enhanced with actual category/product names
          items.push({ label: 'Current Page', to: path });
        }
      }
    } else if (path === '/contact') {
      items.push({ label: t('nav.contact'), to: '/contact' });
    } else if (path === '/about') {
      items.push({ label: t('nav.about'), to: '/about' });
    }
    
    return items;
  };

  const breadcrumbs = customItems.length > 0 ? customItems : getDefaultBreadcrumbs();

  if (breadcrumbs.length <= 1) return null;

  return (
    <nav className="text-gray-600 mb-4 md:mb-6 px-4 lg:px-8">
      <div className="flex items-center space-x-1 md:space-x-2 overflow-x-auto">
        {breadcrumbs.map((item, index) => (
          <React.Fragment key={index}>
            {index === breadcrumbs.length - 1 ? (
              <span className="text-gray-800 text-sm md:text-base font-medium whitespace-nowrap">{item.label}</span>
            ) : (
              <>
                <Link 
                  to={item.to} 
                  className="text-gray-600 text-sm md:text-base hover:text-primary transition-colors whitespace-nowrap"
                >
                  {item.label}
                </Link>
                <span className="text-gray-400 text-sm md:text-base">{" > "}</span>
              </>
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
};

export default Breadcrumb;
