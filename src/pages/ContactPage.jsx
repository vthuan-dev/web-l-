import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useLanguage } from '../utils/LanguageContext';
import { loadData, setPageTitle, setPageMeta } from '../utils/helpers';
import Breadcrumb from '../components/Breadcrumb';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Custom CSS to fix map z-index issues
const mapStyles = `
  .leaflet-container {
    z-index: 1 !important;
  }
  .leaflet-control-container {
    z-index: 2 !important;
  }
`;

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const ContactPage = () => {
  const { t } = useLanguage();
  const [contactData, setContactData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
  const contacts = await loadData('contacts.json');
  setContactData(contacts);
      } catch (error) {
        console.error('Error loading contact data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setPageTitle(t('contactPage.title'));
    setPageMeta(t('contactPage.description'), t('contactPage.title'));
  }, [t]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  const breadcrumbs = [
    { label: t('breadcrumb.home'), to: '/' },
    { label: t('nav.contact'), to: '/contact' }
  ];

  return (
    <div className="flex flex-col bg-white min-h-screen">
      {/* Inject custom CSS for map z-index fix */}
      <style dangerouslySetInnerHTML={{ __html: mapStyles }} />
      
      <div className="container mx-auto px-4 lg:px-8 py-6">
        {/* Breadcrumb */}
        <Breadcrumb customItems={breadcrumbs} />

        {/* Page Title */}
        <h1 className="text-black text-2xl md:text-3xl lg:text-4xl font-bold mb-8 text-center lg:text-left">
          {t('contactPage.title')}
        </h1>

        {/* Contact Information and Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Contact Info Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-primary">{t('contactPage.companyInfo.title')}</h2>
            
            {contactData && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-base md:text-lg mb-2">{t('contactPage.companyInfo.phone')}</h3>
                  <div className="space-y-1 text-gray-700 text-sm md:text-base">
                    {contactData.company.phoneContacts ? (
                      contactData.company.phoneContacts.map((contact, index) => (
                        <p key={index}>
                          <span className="font-medium">{contact.phone}</span>
                          <span className="text-primary ml-2">- {contact.name}</span>
                        </p>
                      ))
                    ) : (
                      <>
                        <p>{contactData.company.phone}</p>
                        {contactData.company.phone2 && <p>{contactData.company.phone2}</p>}
                        {contactData.company.phone3 && <p>{contactData.company.phone3}</p>}
                      </>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-base md:text-lg mb-2">{t('contactPage.companyInfo.email')}</h3>
                  <p className="text-gray-700 text-sm md:text-base">{contactData.company.email}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-base md:text-lg mb-2">{t('contactPage.companyInfo.website')}</h3>
                  <p className="text-gray-700 text-sm md:text-base">{contactData.company.website}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-base md:text-lg mb-2">{t('contactPage.companyInfo.address')}</h3>
                  <div className="space-y-2 text-gray-700 text-sm md:text-base">
                    {contactData.locations && contactData.locations.map((location, index) => (
                      <div key={index} className="border-l-4 border-primary pl-3">
                        <p><strong>{location.name}:</strong></p>
                        <p>{location.address}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-base md:text-lg mb-2">{t('contactPage.companyInfo.businessHours')}</h3>
                  <div className="space-y-1 text-gray-700 text-sm md:text-base">
                    <p>{t('contactPage.businessHours.weekdays')}</p>
                    <p>{t('contactPage.businessHours.weekend')}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Map */}
          <div className="h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden shadow-lg relative z-0">
            <h3 className="text-lg md:text-xl font-semibold mb-4 text-center">{t('contactPage.mapTitle')}</h3>
            {contactData && contactData.locations && contactData.locations.length > 0 && (
              <MapContainer
                center={[contactData.locations[0].lat, contactData.locations[0].lng]}
                zoom={13}
                style={{ height: '90%', width: '100%', zIndex: 0 }}
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
            )}
          </div>
        </div>

        {/* Social Media Section */}
        <h2 className="text-black text-2xl md:text-3xl lg:text-4xl font-bold mb-6 text-center lg:text-left">
          {t('contact.socialMedia')}
        </h2>

        {/* Social Media Links */}
        <div className="flex flex-col sm:flex-row justify-center gap-6 md:gap-8 mb-8">
          {contactData && (
            <>
              <a
                href={contactData.socialMedia.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-blue-600 text-white px-6 py-4 md:px-8 md:py-5 rounded-xl hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-3 text-base md:text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <svg className="w-6 h-6 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </a>
              <a
                href={contactData.socialMedia.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-red-600 text-white px-6 py-4 md:px-8 md:py-5 rounded-xl hover:bg-red-700 transition-all duration-300 flex items-center justify-center gap-3 text-base md:text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <svg className="w-6 h-6 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                YouTube
              </a>
              <a
                href={contactData.socialMedia.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-black text-white px-6 py-4 md:px-8 md:py-5 rounded-xl hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-3 text-base md:text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <svg className="w-6 h-6 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
                TikTok
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
