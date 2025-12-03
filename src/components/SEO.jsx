import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SEO = ({ 
  title, 
  description, 
  keywords, 
  image, 
  type = 'website',
  structuredData 
}) => {
  const location = useLocation();
  const currentUrl = `${window.location.origin}${location.pathname}`;

  useEffect(() => {
    // Set page title
    document.title = title ? `${title} | Wizus Food` : 'Wizus Food';

    // Set meta description
    const setMeta = (name, content) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Set Open Graph meta tags
    const setOGMeta = (property, content) => {
      let ogMeta = document.querySelector(`meta[property="${property}"]`);
      if (!ogMeta) {
        ogMeta = document.createElement('meta');
        ogMeta.setAttribute('property', property);
        document.head.appendChild(ogMeta);
      }
      ogMeta.setAttribute('content', content);
    };

    // Set Twitter Card meta tags
    const setTwitterMeta = (name, content) => {
      let twitterMeta = document.querySelector(`meta[name="${name}"]`);
      if (!twitterMeta) {
        twitterMeta = document.createElement('meta');
        twitterMeta.setAttribute('name', name);
        document.head.appendChild(twitterMeta);
      }
      twitterMeta.setAttribute('content', content);
    };

    // Basic meta tags
    setMeta('description', description);
    if (keywords) setMeta('keywords', keywords);

    // Open Graph
    setOGMeta('og:title', title || 'Wizus Food');
    setOGMeta('og:description', description);
    setOGMeta('og:type', type);
    setOGMeta('og:url', currentUrl);
    setOGMeta('og:site_name', 'Wizus Food');
    
    if (image) {
      setOGMeta('og:image', image);
      setOGMeta('og:image:alt', title || 'Wizus Food');
    }

    // Twitter Card
    setTwitterMeta('twitter:card', 'summary_large_image');
    setTwitterMeta('twitter:title', title || 'Wizus Food');
    setTwitterMeta('twitter:description', description);
    if (image) setTwitterMeta('twitter:image', image);

    // Structured Data (JSON-LD)
    if (structuredData) {
      let script = document.querySelector('#structured-data');
      if (!script) {
        script = document.createElement('script');
        script.setAttribute('id', 'structured-data');
        script.setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(structuredData);
    }

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', currentUrl);

  }, [title, description, keywords, image, type, structuredData, currentUrl]);

  return null; // This component doesn't render anything
};

export default SEO;
