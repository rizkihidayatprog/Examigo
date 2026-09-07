import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  noindex?: boolean;
  structuredData?: Record<string, any>;
}

const DEFAULT_TITLE = 'Examigo - Platform Pembuat Soal Ujian Online AI & CBT Anti-Contek';
const DEFAULT_DESCRIPTION =
  'Examigo adalah platform pembuat soal ujian online cerdas berbasis AI dan CBT modern. Dilengkapi bank soal otomatis, sistem anti-contek, dan penilaian instan untuk guru dan sekolah.';
const DEFAULT_KEYWORDS =
  'aplikasi ujian online, pembuat soal ai, cbt ujian sekolah, software ujian anti contek, bank soal otomatis, aplikasi guru cerdas, exam builder saas, ujian online indonesia';
const DEFAULT_IMAGE = 'https://examigo.id/images/og-image.jpg';

function updateMetaTag(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.querySelector(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function updateLinkTag(rel: string, href: string) {
  let element = document.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
}

export function useSEO({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  canonical,
  ogImage = DEFAULT_IMAGE,
  ogType = 'website',
  noindex = false,
  structuredData,
}: SEOProps) {
  const location = useLocation();

  useEffect(() => {
    // 1. Title formatting
    const formattedTitle = title ? `${title} | Examigo` : DEFAULT_TITLE;
    document.title = formattedTitle;

    // 2. Canonical URL
    const canonicalUrl = canonical || `https://examigo.id${location.pathname}`;
    updateLinkTag('canonical', canonicalUrl);

    // 3. Basic Meta
    updateMetaTag('name', 'description', description);
    updateMetaTag('name', 'keywords', keywords);
    updateMetaTag('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

    // 4. OpenGraph Tags
    updateMetaTag('property', 'og:title', formattedTitle);
    updateMetaTag('property', 'og:description', description);
    updateMetaTag('property', 'og:url', canonicalUrl);
    updateMetaTag('property', 'og:type', ogType);
    updateMetaTag('property', 'og:image', ogImage);

    // 5. Twitter Card Tags
    updateMetaTag('name', 'twitter:title', formattedTitle);
    updateMetaTag('name', 'twitter:description', description);
    updateMetaTag('name', 'twitter:image', ogImage);

    // 6. Optional Structured Data (JSON-LD)
    let jsonLdScript = document.getElementById('route-jsonld') as HTMLScriptElement | null;
    if (structuredData) {
      if (!jsonLdScript) {
        jsonLdScript = document.createElement('script');
        jsonLdScript.id = 'route-jsonld';
        jsonLdScript.type = 'application/ld+json';
        document.head.appendChild(jsonLdScript);
      }
      jsonLdScript.textContent = JSON.stringify(structuredData);
    } else if (jsonLdScript) {
      jsonLdScript.remove();
    }

    return () => {
      // Clean up dynamic structured data script when unmounting route
      const el = document.getElementById('route-jsonld');
      if (el) el.remove();
    };
  }, [title, description, keywords, canonical, ogImage, ogType, noindex, structuredData, location.pathname]);
}

export default function SEO(props: SEOProps) {
  useSEO(props);
  return null;
}
