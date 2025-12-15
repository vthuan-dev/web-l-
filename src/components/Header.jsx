import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../utils/LanguageContext';

const Header = () => {
  const { t, language, switchLanguage } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/90 sticky top-0 z-50 border-b border-gray-200 shadow-sm">
      <div className="container mx-auto max-w-screen-xl px-4 lg:px-8">
        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between py-3">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img
              src="/images/logo.png"
              alt="Wizus Food"
              className="w-24 h-20 object-contain"
              onError={(e) => {
                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='80' viewBox='0 0 96 80'%3E%3Crect width='96' height='80' fill='%230193E9'/%3E%3Ctext x='48' y='50' text-anchor='middle' fill='white' font-size='14' font-weight='bold'%3EWizus%3C/text%3E%3C/svg%3E";
              }}
            />
          </Link>
          
          {/* Center spacer removed with search */}
          <div className="flex-1" />
          
          {/* Navigation */}
          <nav className="flex items-center gap-6 xl:gap-8">
            <Link 
              to="/" 
              className="text-gray-700 text-base xl:text-lg font-semibold hover:text-primary transition-colors duration-300 relative group"
            >
              {t('nav.home')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              to="/products" 
              className="text-gray-700 text-base xl:text-lg font-semibold hover:text-primary transition-colors duration-300 relative group"
            >
              {t('nav.products')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              to="/contact" 
              className="text-gray-700 text-base xl:text-lg font-semibold hover:text-primary transition-colors duration-300 relative group"
            >
              {t('nav.contact')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              to="/about" 
              className="text-gray-700 text-base xl:text-lg font-semibold hover:text-primary transition-colors duration-300 relative group"
            >
              {t('nav.about')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>
          
          {/* Right side - Language and Contact */}
          <div className="flex items-center gap-4 xl:gap-6 ml-6">
            <div className="flex gap-1">
              <button
                onClick={() => switchLanguage('vi')}
                className={`px-2 py-1 text-xs xl:text-sm rounded border ${
                  language === 'vi' ? 'bg-primary text-white' : 'bg-white text-primary border-primary'
                } transition-colors`}
              >
                VI
              </button>
              <button
                onClick={() => switchLanguage('en')}
                className={`px-2 py-1 text-xs xl:text-sm rounded border ${
                  language === 'en' ? 'bg-primary text-white' : 'bg-white text-primary border-primary'
                } transition-colors`}
              >
                EN
              </button>
            </div>
            <a
              href="tel:+84987055245"
              className="inline-flex items-center gap-2 bg-primary text-white px-3 xl:px-4 py-2 xl:py-2.5 rounded-lg hover:bg-primary-dark transition-all duration-300 text-xs xl:text-sm font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <svg className="w-3 h-3 xl:w-4 xl:h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path d="M2.003 5.884a1 1 0 01.342-1.023l2.4-1.92a1 1 0 011.32.083l1.86 1.86a1 1 0 01.08 1.311l-1.1 1.467a.5.5 0 00-.06.456c.374 1.05 1.18 2.26 2.412 3.492 1.232 1.232 2.442 2.038 3.492 2.412a.5.5 0 00.456-.06l1.467-1.1a1 1 0 011.311.08l1.86 1.86a1 1 0 01.083 1.32l-1.92 2.4a1 1 0 01-1.023.342c-2.39-.598-5.172-2.27-7.838-4.936-2.666-2.666-4.338-5.448-4.936-7.838z"/></svg>
              <span className="hidden lg:inline">+84 987055245</span>
              <span className="lg:hidden">Call</span>
            </a>
          </div>
        </div>

        {/* Tablet Header */}
        <div className="hidden md:flex lg:hidden items-center justify-between py-3">
          <Link to="/" className="flex-shrink-0">
            <img
              src="/images/logo.png"
              alt="Wizus Food"
              className="w-20 h-16 object-contain"
              onError={(e) => {
                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='64' viewBox='0 0 80 64'%3E%3Crect width='80' height='64' fill='%230193E9'/%3E%3Ctext x='40' y='40' text-anchor='middle' fill='white' font-size='12' font-weight='bold'%3EWizus%3C/text%3E%3C/svg%3E";
              }}
            />
          </Link>
          
          <nav className="flex items-center gap-3">
            <Link to="/" className="text-gray-700 text-sm font-semibold hover:text-primary transition-colors duration-300 relative group">
              {t('nav.home')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/products" className="text-gray-700 text-sm font-semibold hover:text-primary transition-colors duration-300 relative group">
              {t('nav.products')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/contact" className="text-gray-700 text-sm font-semibold hover:text-primary transition-colors duration-300 relative group">
              {t('nav.contact')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/about" className="text-gray-700 text-sm font-semibold hover:text-primary transition-colors duration-300 relative group">
              {t('nav.about')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>
          
          <div className="flex items-center gap-3 ml-4">
            <div className="flex gap-1">
              <button
                onClick={() => switchLanguage('vi')}
                className={`px-2 py-1 text-xs rounded ${
                  language === 'vi' ? 'bg-primary text-white' : 'bg-gray-100 text-primary'
                } transition-colors`}
                aria-label="Tiếng Việt"
              >
                VI
              </button>
              <button
                onClick={() => switchLanguage('en')}
                className={`px-2 py-1 text-xs rounded ${
                  language === 'en' ? 'bg-primary text-white' : 'bg-gray-100 text-primary'
                } transition-colors`}
                aria-label="English"
              >
                EN
              </button>
            </div>
            <a
              href="tel:+84987055245"
              className="inline-flex items-center gap-2 bg-primary text-white px-3 py-2 rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold"
              aria-label="Gọi hotline"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path d="M2.003 5.884a1 1 0 01.342-1.023l2.4-1.92a1 1 0 011.32.083l1.86 1.86a1 1 0 01.08 1.311l-1.1 1.467a.5.5 0 00-.06.456c.374 1.05 1.18 2.26 2.412 3.492 1.232 1.232 2.442 2.038 3.492 2.412a.5.5 0 00.456-.06l1.467-1.1a1 1 0 011.311.08l1.86 1.86a1 1 0 01.083 1.32l-1.92 2.4a1 1 0 01-1.023.342c-2.39-.598-5.172-2.27-7.838-4.936-2.666-2.666-4.338-5.448-4.936-7.838z"/></svg>
              <span>+84 987055245</span>
            </a>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between py-3">
          <Link to="/" className="flex-shrink-0">
            <img
              src="/images/logo.png"
              alt="Wizus Food"
              className="w-16 h-12 object-contain"
              onError={(e) => {
                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='48' viewBox='0 0 64 48'%3E%3Crect width='64' height='48' fill='%230193E9'/%3E%3Ctext x='32' y='30' text-anchor='middle' fill='white' font-size='10' font-weight='bold'%3EWizus%3C/text%3E%3C/svg%3E";
              }}
            />
          </Link>
          
          <div className="flex items-center gap-3 ml-3">
            <div className="flex gap-1">
              <button
                onClick={() => switchLanguage('vi')}
                className={`px-2 py-1 text-xs rounded ${
                  language === 'vi' ? 'bg-primary text-white' : 'bg-gray-100 text-primary'
                } transition-colors`}
              >
                VI
              </button>
              <button
                onClick={() => switchLanguage('en')}
                className={`px-2 py-1 text-xs rounded ${
                  language === 'en' ? 'bg-primary text-white' : 'bg-gray-100 text-primary'
                } transition-colors`}
              >
                EN
              </button>
            </div>
            
            <a
              href="tel:+84987055245"
              className="inline-flex items-center gap-1 bg-primary text-white px-2 py-1.5 rounded-lg hover:bg-primary-dark transition-colors text-xs font-semibold"
              aria-label="Gọi hotline"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path d="M2.003 5.884a1 1 0 01.342-1.023l2.4-1.92a1 1 0 011.32.083l1.86 1.86a1 1 0 01.08 1.311l-1.1 1.467a.5.5 0 00-.06.456c.374 1.05 1.18 2.26 2.412 3.492 1.232 1.232 2.442 2.038 3.492 2.412a.5.5 0 00.456-.06l1.467-1.1a1 1 0 011.311.08l1.86 1.86a1 1 0 01.083 1.32l-1.92 2.4a1 1 0 01-1.023.342c-2.39-.598-5.172-2.27-7.838-4.936-2.666-2.666-4.338-5.448-4.936-7.838z"/></svg>
              <span className="hidden sm:inline">+84 987055245</span>
              <span className="sm:hidden">Call</span>
            </a>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-primary transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            {/* Search removed on mobile menu */}
            
            <nav className="py-4 space-y-3">
              <Link 
                to="/" 
                className="block text-primary text-base font-medium hover:text-primary-dark transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.home')}
              </Link>
              <Link 
                to="/products" 
                className="block text-primary text-base font-medium hover:text-primary-dark transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.products')}
              </Link>
              <Link 
                to="/contact" 
                className="block text-primary text-base font-medium hover:text-primary-dark transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.contact')}
              </Link>
              <Link 
                to="/about" 
                className="block text-primary text-base font-medium hover:text-primary-dark transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.about')}
              </Link>
              <div className="pt-3 border-t border-gray-200">
                <div className="text-gray-600 text-sm">+84 987055245</div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
