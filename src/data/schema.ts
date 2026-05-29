import { SITE } from './site';
import type { FaqItem } from './faqs';

export const absoluteUrl = (path: string) => new URL(path, SITE.url).toString();

export const organizationSchema = [
  {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'EducationalOrganization'],
    name: SITE.name,
    url: SITE.url,
    logo: {
      '@type': 'ImageObject',
      url: SITE.ogImage,
      width: 800,
      height: 200,
    },
    description: SITE.description,
    founder: { '@type': 'Person', name: SITE.founder },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Leonardo Murialdo y Gaspar Tello',
      addressLocality: 'Quito',
      addressCountry: 'EC',
      postalCode: '170514',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+593999216079',
      contactType: 'customer service',
      availableLanguage: 'Spanish',
    },
    sameAs: [SITE.facebook, SITE.instagram],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: SITE.name,
    telephone: '+593999216079',
    email: SITE.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Leonardo Murialdo y Gaspar Tello',
      addressLocality: 'Quito',
      addressCountry: 'EC',
      postalCode: '170514',
    },
    openingHours: 'Mo-Fr 08:00-18:00',
    priceRange: '$$',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: SITE.url,
  },
] as const;

export const courseSchema = (
  name: string,
  description: string,
  options: {
    url?: string;
    price?: string;
    courseMode?: 'online' | 'onsite' | 'blended';
  } = {},
) => ({
  '@context': 'https://schema.org',
  '@type': 'Course',
  name,
  description,
  ...(options.url ? { url: absoluteUrl(options.url) } : {}),
  ...(options.courseMode ? { courseMode: options.courseMode } : {}),
  provider: {
    '@type': 'Organization',
    name: SITE.name,
    url: SITE.url,
  },
  offers: {
    '@type': 'Offer',
    availability: 'https://schema.org/InStock',
    priceCurrency: 'USD',
    ...(options.price ? { price: options.price } : {}),
    ...(options.url ? { url: absoluteUrl(options.url) } : {}),
  },
});

export const itemListSchema = (items: { name: string; description: string; url: string; price?: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: courseSchema(item.name, item.description, {
      url: item.url,
      price: item.price,
      courseMode: 'online',
    }),
  })),
});

export const faqSchema = (items: FaqItem[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.a,
    },
  })),
});

export const breadcrumbSchema = (items: { label: string; href: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.label,
    item: absoluteUrl(item.href),
  })),
});

export const articleSchema = (input: {
  title: string;
  description: string;
  canonical: string;
  datePublished: string;
  dateModified?: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: input.title,
  description: input.description,
  datePublished: input.datePublished,
  dateModified: input.dateModified ?? input.datePublished,
  author: {
    '@type': 'Organization',
    name: SITE.name,
    url: SITE.url,
  },
  publisher: {
    '@type': 'Organization',
    name: SITE.name,
    logo: {
      '@type': 'ImageObject',
      url: SITE.ogImage,
    },
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': input.canonical,
  },
});
