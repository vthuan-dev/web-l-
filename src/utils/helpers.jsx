// Utility functions for data loading and SEO

export const loadData = async (filename) => {
  try {
    const response = await fetch(`/data/${filename}`);
    if (!response.ok) {
      throw new Error(`Failed to load ${filename}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error loading ${filename}:`, error);
    return [];
  }
};

export const setPageTitle = (title, language = 'vi') => {
  const suffix = language === 'en' ? 'Wizus Food' : 'Wizus Food';
  document.title = title ? `${title} | ${suffix}` : suffix;
};

export const setPageMeta = (description, title) => {
  // Set meta description
  let metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', description);
  } else {
    metaDescription = document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    metaDescription.setAttribute('content', description);
    document.head.appendChild(metaDescription);
  }

  // Set Open Graph meta tags
  const setOGMeta = (property, content) => {
    let ogMeta = document.querySelector(`meta[property="${property}"]`);
    if (ogMeta) {
      ogMeta.setAttribute('content', content);
    } else {
      ogMeta = document.createElement('meta');
      ogMeta.setAttribute('property', property);
      ogMeta.setAttribute('content', content);
      document.head.appendChild(ogMeta);
    }
  };

  setOGMeta('og:title', title || 'Wizus Food');
  setOGMeta('og:description', description);
  setOGMeta('og:type', 'website');
  setOGMeta('og:url', window.location.href);
};

export const generateProductSlug = (name) => {
  return name
    .toLowerCase()
  .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
  .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
  .replace(/[ìíịỉĩ]/g, 'i')
  .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
  .replace(/[ùúụủũưừứựửữ]/g, 'u')
  .replace(/[ỳýỵỷỹ]/g, 'y')
  .replace(/đ/g, 'd')
  .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};
