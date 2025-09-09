import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  author?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  locale?: string;
  siteName?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title = 'Charlles Augusto - Desenvolvedor Full Stack',
  description = 'Desenvolvedor Full Stack especializado em React, Node.js e tecnologias modernas. Transformando ideias em experiências digitais excepcionais.',
  keywords = [
    'desenvolvedor full stack',
    'react',
    'node.js',
    'typescript',
    'javascript',
    'desenvolvimento web',
    'portfólio',
    'desenvolvedor frontend',
    'desenvolvedor backend',
    'next.js',
    'tailwind css',
    'supabase',
    'charlles augusto'
  ],
  author = 'Charlles Augusto',
  image = '/og-image.jpg',
  url = 'https://charllesaugusto.dev',
  type = 'website',
  locale = 'pt_BR',
  siteName = 'Charlles Augusto - Portfólio'
}) => {
  const fullTitle = title === 'Charlles Augusto - Desenvolvedor Full Stack' 
    ? title 
    : `${title} | Charlles Augusto`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author,
    jobTitle: 'Desenvolvedor Full Stack',
    url: url,
    image: `${url}${image}`,
    sameAs: [
      'https://github.com/charllesaugusto',
      'https://linkedin.com/in/charllesaugusto',
      'https://twitter.com/charllesaugusto'
    ],
    worksFor: {
      '@type': 'Organization',
      name: 'Freelancer'
    },
    knowsAbout: [
      'JavaScript',
      'TypeScript',
      'React',
      'Node.js',
      'Next.js',
      'PostgreSQL',
      'MongoDB',
      'Tailwind CSS',
      'Supabase'
    ]
  };

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content={author} />
      <meta name="robots" content="index,follow" />
      <meta name="googlebot" content="index,follow" />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${url}${image}`} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content={locale} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${url}${image}`} />
      <meta name="twitter:creator" content="@charllesaugusto" />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* Favicon */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>

      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#0f172a" />
      <meta name="msapplication-TileColor" content="#0f172a" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Helmet>
  );
};