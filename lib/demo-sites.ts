import { templates } from './templates';

export const demoSites: Record<string, any> = {
  maryscleaning: {
    slug: 'maryscleaning',
    businessName: "Mary's Cleaning Service",
    template: 'local',
    plan: 'business',
    headline: 'Sparkling clean homes without the stress.',
    description: 'Residential and small-office cleaning with simple scheduling, clear pricing, and friendly service.',
    primaryColor: '#2f5f73',
    accentColor: '#f4a12a',
    pages: ['Home', 'Services', 'Contact'],
    phone: '(555) 123-4567',
    email: 'hello@example.com'
  },
  cookieskitchen: {
    slug: 'cookieskitchen',
    businessName: "Cookie's Kitchen",
    template: 'restaurant',
    plan: 'premium',
    headline: 'Recipes with flavor, love, and a little sass.',
    description: 'Digital cookbooks, talking recipes, kitchen products, and flavorful food content for home cooks.',
    primaryColor: '#7a2f1f',
    accentColor: '#f6a13a',
    pages: ['Home', 'Products', 'Recipes', 'About', 'Contact'],
    phone: '',
    email: 'cookie@example.com'
  }
};

export function getDemoSite(slug: string) {
  if (demoSites[slug]) return demoSites[slug];
  return null;
}

export function getTemplateServices(templateKey: string) {
  return templates[(templateKey as keyof typeof templates) || 'local']?.services || templates.local.services;
}
