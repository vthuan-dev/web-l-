import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../utils/LanguageContext';
import { setPageTitle, setPageMeta } from '../utils/helpers';
import Breadcrumb from '../components/Breadcrumb';

const AboutPage = () => {
  const { t } = useLanguage();

  useEffect(() => {
    setPageTitle(t('nav.about'));
    setPageMeta('Về chúng tôi - Wizus Food', t('nav.about'));
  }, [t]);

  const breadcrumbs = [
    { label: t('breadcrumb.home'), to: '/' },
    { label: t('nav.about'), to: '/about' }
  ];

  return (
    <div className="flex flex-col bg-white min-h-screen">
      <div className="container mx-auto px-4 lg:px-8 py-6">
        {/* Breadcrumb */}
        <Breadcrumb customItems={breadcrumbs} />

        {/* Page Title */}
        <h1 className="text-black text-2xl md:text-3xl lg:text-4xl font-bold mb-8 text-center">
          {t('about.title')}
        </h1>

        {/* Content */}
        <div className="max-w-6xl mx-auto">
          {/* Company Introduction */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">{t('about.introduction.title')}</h2>
            <div className="text-base md:text-lg leading-relaxed text-gray-700 space-y-4">
              <p>
                {t('about.introduction.paragraph1')}
              </p>
              <p>
                {t('about.introduction.paragraph2')}
              </p>
            </div>
          </section>

          {/* Vision & Mission */}
          <section className="mb-12">
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              <div className="bg-primary/5 p-6 lg:p-8 rounded-lg">
                <h3 className="text-xl md:text-2xl font-bold text-primary mb-4">{t('about.vision.title')}</h3>
                <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                  {t('about.vision.content')}
                </p>
              </div>
              <div className="bg-primary/5 p-6 lg:p-8 rounded-lg">
                <h3 className="text-xl md:text-2xl font-bold text-primary mb-4">{t('about.mission.title')}</h3>
                <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                  {t('about.mission.content')}
                </p>
              </div>
            </div>
          </section>

          {/* Our Products */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6 text-center lg:text-left">{t('about.ourProducts.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <Link 
                to="/category/ca-nuoc-ngot" 
                className="text-center p-4 lg:p-6 border border-gray-200 rounded-lg hover:shadow-lg hover:border-primary transition-all duration-300 group cursor-pointer"
              >
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                  <span className="text-xl lg:text-2xl">🐟</span>
                </div>
                <h4 className="font-semibold mb-2 text-sm lg:text-base group-hover:text-primary transition-colors">{t('about.ourProducts.freshwaterFish.title')}</h4>
                <p className="text-xs lg:text-sm text-gray-600">{t('about.ourProducts.freshwaterFish.description')}</p>
              </Link>
              <Link 
                to="/category/ca-tra" 
                className="text-center p-4 lg:p-6 border border-gray-200 rounded-lg hover:shadow-lg hover:border-primary transition-all duration-300 group cursor-pointer"
              >
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                  <span className="text-xl lg:text-2xl">🍤</span>
                </div>
                <h4 className="font-semibold mb-2 text-sm lg:text-base group-hover:text-primary transition-colors">{t('about.ourProducts.catfish.title')}</h4>
                <p className="text-xs lg:text-sm text-gray-600">{t('about.ourProducts.catfish.description')}</p>
              </Link>
              <Link 
                to="/category/cha-ca" 
                className="text-center p-4 lg:p-6 border border-gray-200 rounded-lg hover:shadow-lg hover:border-primary transition-all duration-300 group cursor-pointer"
              >
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                  <span className="text-xl lg:text-2xl">🍱</span>
                </div>
                <h4 className="font-semibold mb-2 text-sm lg:text-base group-hover:text-primary transition-colors">{t('about.ourProducts.fishCake.title')}</h4>
                <p className="text-xs lg:text-sm text-gray-600">{t('about.ourProducts.fishCake.description')}</p>
              </Link>
              <Link 
                to="/category/nong-san" 
                className="text-center p-4 lg:p-6 border border-gray-200 rounded-lg hover:shadow-lg hover:border-primary transition-all duration-300 group cursor-pointer"
              >
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                  <span className="text-xl lg:text-2xl">🌾</span>
                </div>
                <h4 className="font-semibold mb-2 text-sm lg:text-base group-hover:text-primary transition-colors">{t('about.ourProducts.agricultural.title')}</h4>
                <p className="text-xs lg:text-sm text-gray-600">{t('about.ourProducts.agricultural.description')}</p>
              </Link>
            </div>
          </section>

          {/* Quality Commitment */}
          <section className="mb-12 bg-gray-50 p-6 lg:p-8 rounded-lg">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6 text-center">{t('about.qualityCommitment.title')}</h2>
            <div className="grid md:grid-cols-3 gap-4 lg:gap-6">
              <div className="text-center">
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-lg lg:text-2xl">✓</span>
                </div>
                <h4 className="font-semibold mb-2 text-sm lg:text-base">{t('about.qualityCommitment.highQuality.title')}</h4>
                <p className="text-xs lg:text-sm text-gray-600">{t('about.qualityCommitment.highQuality.description')}</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-lg lg:text-2xl">❄️</span>
                </div>
                <h4 className="font-semibold mb-2 text-sm lg:text-base">{t('about.qualityCommitment.coldStorage.title')}</h4>
                <p className="text-xs lg:text-sm text-gray-600">{t('about.qualityCommitment.coldStorage.description')}</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-lg lg:text-2xl">🚚</span>
                </div>
                <h4 className="font-semibold mb-2 text-sm lg:text-base">{t('about.qualityCommitment.fastDelivery.title')}</h4>
                <p className="text-xs lg:text-sm text-gray-600">{t('about.qualityCommitment.fastDelivery.description')}</p>
              </div>
            </div>
          </section>

          {/* Contact CTA */}
          <section className="text-center bg-primary text-white p-6 lg:p-8 rounded-lg">
            <h2 className="text-xl md:text-2xl font-bold mb-4">{t('about.contactCta.title')}</h2>
            <p className="mb-6 text-sm md:text-lg">
              {t('about.contactCta.description')}
            </p>
            <div className="text-lg md:text-xl font-semibold">
              {t('contact.hotline')}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
