export type PlanKey = 'starter' | 'business' | 'premium';

export const plans = {
  starter: {
    name: 'Starter',
    price: 19,
    maxPages: 1,
    allPages: false,
    limitLabel: '1 page',
    description: 'One-page website with business details, service cards, call-to-action, and contact section.'
  },
  business: {
    name: 'Business',
    price: 149,
    maxPages: 3,
    allPages: false,
    limitLabel: 'up to 3 pages',
    description: 'Up to 3 pages with stronger layout, service details, about section, testimonials, and gallery area.'
  },
  premium: {
    name: 'Premium',
    price: 199,
    maxPages: 999,
    allPages: true,
    limitLabel: 'all available pages/sections',
    description: 'All available page and section options with custom sections, advanced page choices, stronger homepage, and optional custom domain help.'
  }
} as const;

export const templates = {
  local: {
    name: 'Local Business',
    headline: 'Professional services made simple for your local community.',
    description: 'A clean website for service providers who need a trustworthy online presence, clear service details, and easy contact options.',
    services: [
      { title: 'Landing Page', text: 'A focused homepage that introduces the business, explains what it offers, and moves visitors toward booking or contacting.' },
      { title: 'Service Highlights', text: 'Clear service cards that explain what the customer does, who it helps, and why people should choose them.' },
      { title: 'Contact Section', text: 'Phone, email, service area, and call-to-action details so visitors know exactly how to reach the business.' }
    ]
  },
  restaurant: {
    name: 'Restaurant / Cookbook',
    headline: 'Flavor, personality, and easy online ordering all in one place.',
    description: 'A bold food website for cooks, restaurants, digital recipe products, meal makers, and kitchen brands.',
    services: [
      { title: 'Featured Menu', text: 'Showcase meals, recipes, bundles, signature dishes, or digital food products in a polished layout.' },
      { title: 'Recipe Product Page', text: 'Explain what buyers receive, show the value, and guide visitors to purchase or download.' },
      { title: 'Order or Contact Area', text: 'Add buttons for Gumroad, order forms, catering requests, or direct customer messages.' }
    ]
  },
  realestate: {
    name: 'Real Estate / Investor',
    headline: 'Make your property, investment, or real estate brand look official.',
    description: 'A professional layout for real estate groups, investor education products, property pages, and local services.',
    services: [
      { title: 'Investment Landing Page', text: 'Explain your real estate brand, investor education offer, or property service in simple, trustworthy language.' },
      { title: 'Resource Sections', text: 'Add beginner guides, product offers, market education, or REIT education without needing a full blog first.' },
      { title: 'Lead Capture Area', text: 'Guide visitors to join your list, request information, or contact the business for the next step.' }
    ]
  },
  wellness: {
    name: 'Wellness Product',
    headline: 'A calm, trusted website for wellness guides, trackers, and digital products.',
    description: 'A warm layout for wellness journals, education products, trackers, reminders, and lifestyle brands.',
    services: [
      { title: 'Product Landing Page', text: 'Explain the wellness product, who it helps, what is included, and why it is useful.' },
      { title: 'Benefits Section', text: 'Highlight healthy habits, reminders, education, recipes, trackers, or guided steps in simple language.' },
      { title: 'Download Section', text: 'Send buyers to Gumroad, checkout, or a download page with a clear button and product details.' }
    ]
  },
  portfolio: {
    name: 'Film / Portfolio',
    headline: 'Showcase your work, your story, and your creative brand.',
    description: 'A visual portfolio website for filmmakers, creators, artists, writers, performers, and production companies.',
    services: [
      { title: 'Portfolio Homepage', text: 'Introduce the creator or company with a strong headline, style, and featured work section.' },
      { title: 'Project Pages', text: 'Add pages for films, scripts, shows, books, services, or creative products when using Business or Premium.' },
      { title: 'Contact / Booking', text: 'Give producers, clients, collaborators, and customers a clear way to reach out.' }
    ]
  },
  nonprofit: {
    name: 'Nonprofit / Community',
    headline: 'A welcoming website for your mission, programs, and community impact.',
    description: 'A clean mission-based site for shelters, youth programs, community projects, outreach, and donation pages.',
    services: [
      { title: 'Mission Page', text: 'Tell visitors what the organization stands for and why the mission matters.' },
      { title: 'Programs Section', text: 'Explain services, community programs, volunteer needs, or outreach activities.' },
      { title: 'Support Section', text: 'Add donation links, volunteer forms, contact details, or community partner information.' }
    ]
  }
};

export type TemplateKey = keyof typeof templates;

export function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 50) || 'customer-site';
}
