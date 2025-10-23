import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface PageSEOConfig {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  type?: 'website' | 'article' | 'profile';
}

const defaultConfig: PageSEOConfig = {
  title: 'Charlles Augusto - Desenvolvedor Full-Stack',
  description: 'Desenvolvedor Full-Stack especializado em Cybersecurity com experiência em Python, React, Java, Golang e IA',
  keywords: [
    'desenvolvedor full stack',
    'cybersecurity',
    'python',
    'react',
    'java',
    'golang',
    'inteligência artificial'
  ],
  image: '/og-image.jpg',
  type: 'website'
};

export const usePageSEO = (config: PageSEOConfig = {}) => {
  const location = useLocation();
  const { title, description, keywords, image, type } = { ...defaultConfig, ...config };

  useEffect(() => {
    // Update title
    if (title) {
      document.title = title;
    }

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && description) {
      metaDescription.setAttribute('content', description);
    }

    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords && keywords) {
      metaKeywords.setAttribute('content', keywords.join(', '));
    }

    // Update OG tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && title) {
      ogTitle.setAttribute('content', title);
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription && description) {
      ogDescription.setAttribute('content', description);
    }

    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage && image) {
      ogImage.setAttribute('content', `https://charllesaugusto.dev${image}`);
    }

    const ogType = document.querySelector('meta[property="og:type"]');
    if (ogType && type) {
      ogType.setAttribute('content', type);
    }

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute('content', `https://charllesaugusto.dev${location.pathname}`);
    }

    // Update Twitter tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle && title) {
      twitterTitle.setAttribute('content', title);
    }

    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription && description) {
      twitterDescription.setAttribute('content', description);
    }

    const twitterImage = document.querySelector('meta[name="twitter:image"]');
    if (twitterImage && image) {
      twitterImage.setAttribute('content', `https://charllesaugusto.dev${image}`);
    }

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `https://charllesaugusto.dev${location.pathname}`);
  }, [title, description, keywords, image, type, location.pathname]);
};
