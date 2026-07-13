export type PlanKey = 'free' | 'starter' | 'business' | 'premium';
export type PaidPlanKey = Exclude<PlanKey, 'free'>;

export const EXTRA_PAGE_PRICE = 10;

export const plans = {
  free: {
    name: 'Free Launch Page',
    monthlyPrice: 0,
    annualPrice: 0,
    defaultBilling: 'free',
    maxPages: 1,
    allPages: false,
    limitLabel: '1 basic page included',
    priceLabel: 'Free',
    annualLabel: 'Free',
    creditsLabel: '5 demo Cookie Credits/month',
    branded: true,
    description: 'Start with one basic branded website page, limited templates, a Cookie Mini Website Builder footer badge, and AI Video Studio kit access.'
  },
  starter: {
    name: 'Starter Pro Subscription',
    monthlyPrice: 19,
    annualPrice: 190,
    defaultBilling: 'subscription',
    maxPages: 1,
    allPages: false,
    limitLabel: '1 pro page included',
    priceLabel: '$19/month',
    annualLabel: '$190/year',
    creditsLabel: '20 Cookie Credits/month',
    branded: false,
    description: 'A polished one-page website with better templates, live customer subdomain, dashboard editing, and monthly hosted access while subscribed.'
  },
  business: {
    name: 'Business Subscription',
    monthlyPrice: 30,
    annualPrice: 300,
    defaultBilling: 'subscription',
    maxPages: 3,
    allPages: false,
    limitLabel: 'up to 3 pages included',
    priceLabel: '$30/month',
    annualLabel: '$300/year',
    creditsLabel: '50 Cookie Credits/month',
    branded: false,
    description: 'A stronger small-business website with up to 3 pages, services/about/contact sections, customer dashboard, and live hosting.'
  },
  premium: {
    name: 'Premium Subscription',
    monthlyPrice: 50,
    annualPrice: 500,
    defaultBilling: 'subscription',
    maxPages: 999,
    allPages: true,
    limitLabel: 'all available pages/sections included',
    priceLabel: '$50/month',
    annualLabel: '$500/year',
    creditsLabel: '100 Cookie Credits/month',
    branded: false,
    description: 'The full builder experience with all built-in pages and section options unlocked, premium templates, and the highest monthly Cookie Credit allowance.'
  }
} as const;

export function normalizePlanKey(value: any): PlanKey {
  if (value === 'free' || value === 'starter' || value === 'business' || value === 'premium') return value;
  return 'starter';
}

export function isPaidPlan(plan: PlanKey): plan is PaidPlanKey {
  return plan !== 'free';
}

export function getExtraPageCount(plan: PlanKey, selectedPageCount: number) {
  const item = plans[plan];
  if (item.allPages) return 0;
  return Math.max(0, selectedPageCount - item.maxPages);
}

export function getPlanPrice(plan: PlanKey, selectedPageCount: number = plans[plan].maxPages as number) {
  if (plan === 'free') return 0;
  const extraPages = getExtraPageCount(plan, selectedPageCount);
  return plans[plan].monthlyPrice + extraPages * EXTRA_PAGE_PRICE;
}

export function getBillingLabel(plan: PlanKey, selectedPageCount: number = plans[plan].maxPages as number) {
  if (plan === 'free') return 'Free';
  const price = getPlanPrice(plan, selectedPageCount);
  const extraPages = getExtraPageCount(plan, selectedPageCount);
  return extraPages > 0 ? `$${price}/month incl. ${extraPages} extra page${extraPages > 1 ? 's' : ''}` : `$${price}/month`;
}

export function getBaseBillingLabel(plan: PlanKey) {
  return plan === 'free' ? 'Free launch page' : `$${plans[plan].monthlyPrice}/month subscription`;
}

export const pageOptions = ['Home', 'About', 'Services', 'Products', 'Gallery', 'Testimonials', 'Contact', 'FAQ'];

export const templates = {
  local: {
    name: 'Local Business',
    tone: '3D local service layout',
    defaultPrimary: '#1f3153',
    defaultAccent: '#f59e0b',
    headline: 'Professional services made simple for your local community.',
    description: 'A clean website for service providers who need a trustworthy online presence, clear service details, and easy contact options.',
    art: { icon: '🏪', label: '3D Local Service Desk', details: 'Booking cards • Map pin • Trust badges' },
    services: [
      { title: 'Landing Page', text: 'A focused homepage that introduces the business, explains what it offers, and moves visitors toward booking or contacting.' },
      { title: 'Service Highlights', text: 'Clear service cards that explain what the customer does, who it helps, and why people should choose them.' },
      { title: 'Contact Section', text: 'Email, service area, and call-to-action details so visitors know exactly how to reach the business.' }
    ]
  },
  restaurant: {
    name: 'Restaurant / Cookbook',
    tone: '3D food brand layout',
    defaultPrimary: '#7f1d1d',
    defaultAccent: '#f97316',
    headline: 'Flavor, personality, and easy online ordering all in one place.',
    description: 'A bold food website for cooks, restaurants, digital recipe products, meal makers, and kitchen brands.',
    art: { icon: '🍽️', label: '3D Signature Food Board', details: 'Menu cards • Recipe stack • Order button' },
    services: [
      { title: 'Featured Menu', text: 'Showcase meals, recipes, bundles, signature dishes, or digital food products in a polished layout.' },
      { title: 'Recipe Product Page', text: 'Explain what buyers receive, show the value, and guide visitors to purchase or download.' },
      { title: 'Order or Contact Area', text: 'Add buttons for Gumroad, order forms, catering requests, or direct customer messages.' }
    ]
  },
  realestate: {
    name: 'Real Estate / Investor',
    tone: '3D investor trust layout',
    defaultPrimary: '#12312b',
    defaultAccent: '#d4af37',
    headline: 'Make your property, investment, or real estate brand look official.',
    description: 'A professional layout for real estate groups, investor education products, property pages, and local services.',
    art: { icon: '🏘️', label: '3D Property Trust Panel', details: 'Listings • Investor cards • Lead form' },
    services: [
      { title: 'Investment Landing Page', text: 'Explain your real estate brand, investor education offer, or property service in simple, trustworthy language.' },
      { title: 'Resource Sections', text: 'Add beginner guides, product offers, market education, or REIT education without needing a full blog first.' },
      { title: 'Lead Capture Area', text: 'Guide visitors to join your list, request information, or contact the business for the next step.' }
    ]
  },
  wellness: {
    name: 'Wellness Product',
    tone: '3D wellness product layout',
    defaultPrimary: '#31572c',
    defaultAccent: '#84cc16',
    headline: 'A calm, trusted website for wellness guides, trackers, and digital products.',
    description: 'A warm layout for wellness journals, education products, trackers, reminders, and lifestyle brands.',
    art: { icon: '🌿', label: '3D Wellness Journey Card', details: 'Guides • Trackers • Calm product stack' },
    services: [
      { title: 'Product Landing Page', text: 'Explain the wellness product, who it helps, what is included, and why it is useful.' },
      { title: 'Benefits Section', text: 'Highlight healthy habits, reminders, education, recipes, trackers, or guided steps in simple language.' },
      { title: 'Download Section', text: 'Send buyers to Gumroad, checkout, or a download page with a clear button and product details.' }
    ]
  },
  portfolio: {
    name: 'Film / Portfolio',
    tone: '3D creator showcase layout',
    defaultPrimary: '#111827',
    defaultAccent: '#a855f7',
    headline: 'Showcase your work, your story, and your creative brand.',
    description: 'A visual portfolio website for filmmakers, creators, artists, writers, performers, and production companies.',
    art: { icon: '🎬', label: '3D Creator Spotlight Wall', details: 'Projects • Reels • Booking cards' },
    services: [
      { title: 'Portfolio Homepage', text: 'Introduce the creator or company with a strong headline, style, and featured work section.' },
      { title: 'Project Pages', text: 'Add pages for films, scripts, shows, books, services, or creative products when using Business or Premium.' },
      { title: 'Contact / Booking', text: 'Give producers, clients, collaborators, and customers a clear way to reach out.' }
    ]
  },
  nonprofit: {
    name: 'Nonprofit / Community',
    tone: '3D community mission layout',
    defaultPrimary: '#155e75',
    defaultAccent: '#22c55e',
    headline: 'A welcoming website for your mission, programs, and community impact.',
    description: 'A clean mission-based site for shelters, youth programs, community projects, outreach, and donation pages.',
    art: { icon: '🤝', label: '3D Community Impact Board', details: 'Mission • Programs • Support cards' },
    services: [
      { title: 'Mission Page', text: 'Tell visitors what the organization stands for and why the mission matters.' },
      { title: 'Programs Section', text: 'Explain services, community programs, volunteer needs, or outreach activities.' },
      { title: 'Support Section', text: 'Add donation links, volunteer forms, contact details, or community partner information.' }
    ]
  }
};

export type TemplateKey = keyof typeof templates;

export const templateThemeClasses: Record<TemplateKey, string> = {
  local: 'template-local',
  restaurant: 'template-restaurant',
  realestate: 'template-realestate',
  wellness: 'template-wellness',
  portfolio: 'template-portfolio',
  nonprofit: 'template-nonprofit'
};

export const templateAccentWords: Record<TemplateKey, string> = {
  local: 'Local Service Website',
  restaurant: 'Food Brand Website',
  realestate: 'Real Estate Website',
  wellness: 'Wellness Product Website',
  portfolio: 'Creative Portfolio Website',
  nonprofit: 'Mission & Community Website'
};

export const pageCopy: Record<string, { title: string; body: string }> = {
  About: { title: 'About Us', body: 'Share the story behind the business, who it serves, and why customers can trust the brand.' },
  Services: { title: 'Services', body: 'Break down the main services, what each service includes, and how customers can get started.' },
  Products: { title: 'Products', body: 'Showcase digital products, physical products, packages, downloads, bundles, or featured offers.' },
  Gallery: { title: 'Gallery', body: 'Display photos, examples, portfolio samples, before-and-after images, or visual proof of the work.' },
  Testimonials: { title: 'Testimonials', body: 'Highlight customer reviews, success stories, feedback, or social proof that builds trust.' },
  Contact: { title: 'Contact', body: 'Make it easy for visitors to reach the business by email, booking link, or contact form.' },
  FAQ: { title: 'Frequently Asked Questions', body: 'Answer common questions about services, pricing, turnaround time, delivery, booking, or support.' }
};

export function normalizePages(value: any) {
  let pages: string[] = [];
  if (Array.isArray(value)) pages = value;
  else if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) pages = parsed;
    } catch {
      pages = value.split(',');
    }
  }

  const cleaned = pages
    .map(page => String(page || '').trim())
    .filter(Boolean)
    .filter((page, index, array) => array.indexOf(page) === index)
    .filter(page => pageOptions.includes(page));

  return cleaned.includes('Home') ? cleaned : ['Home', ...cleaned];
}

export function sectionId(page: string) {
  return String(page || 'home').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'home';
}

export function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 50) || 'customer-site';
}
