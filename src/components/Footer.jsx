import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../utils/LanguageContext';
import { loadData } from '../utils/helpers';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Footer = () => {
  const { t } = useLanguage();
  const [footerData, setFooterData] = useState(null);
  const [contactData, setContactData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const [footer, contact] = await Promise.all([
        loadData('footer.json'),
        loadData('contacts.json')
      ]);
      setFooterData(footer);
      setContactData(contact);
    };
    fetchData();
  }, []);

  if (!footerData) return null;

  return (
    <footer className="bg-footer-bg">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Desktop Footer */}
        <div className="hidden lg:block">
          {/* Footer Header */}
          <div className="grid grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">
                {t('footer.links')}
              </h3>
              <div className="space-y-2">
                <Link to="/" className="block text-white text-sm hover:text-primary transition-colors">
                  {t('footer.home')}
                </Link>
                <Link to="/products" className="block text-white text-sm hover:text-primary transition-colors">
                  {t('footer.products')}
                </Link>
                <Link to="/contact" className="block text-white text-sm hover:text-primary transition-colors">
                  {t('footer.contactLink')}
                </Link>
                <Link to="/about" className="block text-white text-sm hover:text-primary transition-colors">
                  {t('footer.about')}
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-white text-lg font-semibold mb-4">
                {t('footer.contact')}
              </h3>
              <div className="space-y-2">
                {footerData.companyInfo.phones.map((phone, index) => (
                  <div key={index} className="text-white text-sm">{phone}</div>
                ))}
                <div className="text-white text-sm">
                  Email: {footerData.companyInfo.email}
                </div>
              </div>
              <div className="mt-4 text-white text-xs space-y-1">
                <div>Việt Nam: {footerData.companyInfo.addresses.vietnam}</div>
                <div>Philippines: {footerData.companyInfo.addresses.philippines}</div>
                <div>Văn phòng: {footerData.companyInfo.addresses.office}</div>
              </div>
            </div>

            <div>
              <h3 className="text-white text-lg font-semibold mb-4">
                {t('footer.map')}
              </h3>
              <div className="w-full h-32 rounded overflow-hidden">
                {contactData && contactData.locations && contactData.locations.length > 0 ? (
                  <MapContainer
                    center={[contactData.locations[0].lat, contactData.locations[0].lng]}
                    zoom={13}
                    style={{ height: '100%', width: '100%', zIndex: 0 }}
                    zoomControl={false}
                    attributionControl={false}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {contactData.locations.map((location, index) => (
                      <Marker key={index} position={[location.lat, location.lng]}>
                        <Popup>
                          <div>
                            <strong>{location.name}</strong><br />
                            {location.address}
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                ) : (
                  <div className="w-full h-full bg-gray-600 rounded flex items-center justify-center">
                    <span className="text-gray-300 text-sm">Interactive Map</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-white text-lg font-semibold mb-4">
                {t('footer.socialMedia')}
              </h3>
              <div className="flex flex-col space-y-3">
                <a 
                  href={footerData.socialMedia.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white text-sm hover:text-primary transition-colors group"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  {t('footer.socialLinks.facebook')}
                </a>
                <a 
                  href={footerData.socialMedia.youtube} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white text-sm hover:text-primary transition-colors group"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  {t('footer.socialLinks.youtube')}
                </a>
                <a 
                  href={footerData.socialMedia.tiktok} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white text-sm hover:text-primary transition-colors group"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                  {t('footer.socialLinks.tiktok')}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Tablet Footer */}
        <div className="hidden md:block lg:hidden">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-white text-base font-semibold mb-3">
                {t('footer.links')}
              </h3>
              <div className="space-y-1">
                <Link to="/" className="block text-white text-sm hover:text-primary transition-colors">
                  {t('footer.home')}
                </Link>
                <Link to="/products" className="block text-white text-sm hover:text-primary transition-colors">
                  {t('footer.products')}
                </Link>
                <Link to="/contact" className="block text-white text-sm hover:text-primary transition-colors">
                  {t('footer.contactLink')}
                </Link>
                <Link to="/about" className="block text-white text-sm hover:text-primary transition-colors">
                  {t('footer.about')}
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-white text-base font-semibold mb-3">
                {t('footer.contact')}
              </h3>
              <div className="space-y-1">
                {footerData.companyInfo.phones.slice(0, 2).map((phone, index) => (
                  <div key={index} className="text-white text-sm">{phone}</div>
                ))}
                <div className="text-white text-sm">
                  {footerData.companyInfo.email}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-white text-base font-semibold mb-3">
                {t('footer.socialMedia')}
              </h3>
              <div className="flex flex-wrap gap-4">
                <a href={footerData.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white text-sm hover:text-primary transition-colors group">
                  <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </a>
                <a href={footerData.socialMedia.youtube} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white text-sm hover:text-primary transition-colors group">
                  <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  Youtube
                </a>
                <a href={footerData.socialMedia.tiktok} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white text-sm hover:text-primary transition-colors group">
                  <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                  TikTok
                </a>
              </div>
            </div>
            
            <div>
              <div className="w-full h-24 rounded overflow-hidden">
                {contactData && contactData.locations && contactData.locations.length > 0 ? (
                  <MapContainer
                    center={[contactData.locations[0].lat, contactData.locations[0].lng]}
                    zoom={12}
                    style={{ height: '100%', width: '100%', zIndex: 0 }}
                    zoomControl={false}
                    attributionControl={false}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {contactData.locations.map((location, index) => (
                      <Marker key={index} position={[location.lat, location.lng]}>
                        <Popup>
                          <div>
                            <strong>{location.name}</strong><br />
                            {location.address}
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                ) : (
                  <div className="w-full h-full bg-gray-600 rounded flex items-center justify-center">
                    <span className="text-gray-300 text-xs">Map</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Footer */}
        <div className="md:hidden space-y-6">
          <div>
            <h3 className="text-white text-base font-semibold mb-3">
              {t('footer.contact')}
            </h3>
            <div className="space-y-1">
              <div className="text-white text-sm">{footerData.companyInfo.phones[0]}</div>
              <div className="text-white text-sm">{footerData.companyInfo.email}</div>
            </div>
          </div>

          <div>
            <h3 className="text-white text-base font-semibold mb-3">
              {t('footer.links')}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <Link to="/" className="text-white text-sm hover:text-primary transition-colors">
                {t('footer.home')}
              </Link>
              <Link to="/products" className="text-white text-sm hover:text-primary transition-colors">
                {t('footer.products')}
              </Link>
              <Link to="/contact" className="text-white text-sm hover:text-primary transition-colors">
                {t('footer.contactLink')}
              </Link>
              <Link to="/about" className="text-white text-sm hover:text-primary transition-colors">
                {t('footer.about')}
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-white text-base font-semibold mb-3">
              {t('footer.socialMedia')}
            </h3>
            <div className="flex flex-wrap gap-4">
              <a href={footerData.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white text-sm hover:text-primary transition-colors group">
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </a>
              <a href={footerData.socialMedia.youtube} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white text-sm hover:text-primary transition-colors group">
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                Youtube
              </a>
              <a href={footerData.socialMedia.tiktok} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white text-sm hover:text-primary transition-colors group">
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
                TikTok
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-footer-dark py-3">
        <div className="container mx-auto px-4 text-center">
          <span className="text-white text-sm">
            {t('footer.copyright')}
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
