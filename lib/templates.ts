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
    description: 'A polished one-page website with stronger templates, live customer subdomain, dashboard editing, and monthly hosted access while subscribed.'
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

export const pageOptions = [
  'Home', 'About', 'Services', 'Products', 'Menu', 'Specials', 'Prices', 'Packages', 'Booking',
  'Gallery', 'Testimonials', 'Contact', 'FAQ', 'Shop', 'Events', 'Programs', 'Donate', 'Projects',
  'Portfolio', 'Resources', 'Service Area', 'Before & After'
];

export type ServiceCard = { title: string; text: string };
export type PageContentMap = Record<string, { title: string; body: string }>;
export type TemplateCategoryKey =
  | 'food'
  | 'beauty'
  | 'realestate'
  | 'wellness'
  | 'localservices'
  | 'digitalproducts'
  | 'nonprofit'
  | 'portfolio'
  | 'cleaning'
  | 'coaching'
  | 'kids'
  | 'shop';

export type TemplateStyleKey =
  | '3d'
  | 'realistic'
  | 'cartoon'
  | 'floral'
  | 'luxury'
  | 'bold'
  | 'warm'
  | 'minimal'
  | 'cinematic';

export type TemplateDefinition = {
  name: string;
  category: TemplateCategoryKey;
  categoryName: string;
  style: TemplateStyleKey;
  styleName: string;
  tone: string;
  defaultPrimary: string;
  defaultAccent: string;
  headline: string;
  description: string;
  defaultPages: string[];
  featured?: boolean;
  art: {
    icon: string;
    label: string;
    details: string;
    image: string;
    alt: string;
  };
  services: ServiceCard[];
};

const art = (file: string) => `/template-art/${file}.svg`;

export const templates = {
  food_realistic: {
    name: 'Restaurant / Food — Realistic Kitchen',
    category: 'food',
    categoryName: 'Restaurant / Food Business',
    style: 'realistic',
    styleName: 'Realistic Professional',
    tone: 'Food brand website',
    defaultPrimary: '#7f1d1d',
    defaultAccent: '#f97316',
    headline: 'Serve your flavor, specials, and ordering info in one beautiful place.',
    description: 'A warm food-business website for restaurants, cooks, caterers, food trucks, recipe sellers, and kitchen brands.',
    defaultPages: ['Home', 'Menu', 'Specials', 'Gallery', 'Contact'],
    art: { icon: '🍽️', label: 'Signature Kitchen Showcase', details: 'Menu • Specials • Order Info', image: art('food-realistic'), alt: 'Realistic cooking art with warm plated food and kitchen accents' },
    services: [
      { title: 'Signature Menu', text: 'Add your best dishes, meals, bundles, catering trays, or food product offers.' },
      { title: 'Specials & Ordering', text: 'Share limited-time specials, order instructions, pickup details, or delivery notes.' },
      { title: 'Food Gallery', text: 'Show customers what your food looks like before they order or contact you.' }
    ]
  },
  food_cartoon: {
    name: 'Restaurant / Food — Cartoon Fun',
    category: 'food',
    categoryName: 'Restaurant / Food Business',
    style: 'cartoon',
    styleName: 'Cartoon Fun',
    tone: 'Playful food website',
    defaultPrimary: '#9a3412',
    defaultAccent: '#facc15',
    headline: 'A fun food website with big flavor and personality.',
    description: 'A bright, playful website for food creators, dessert sellers, family food brands, and social media food promos.',
    defaultPages: ['Home', 'Menu', 'Gallery', 'FAQ', 'Contact'],
    art: { icon: '🍔', label: 'Cartoon Food Pop', details: 'Menu Cards • Fun Promos • Contact', image: art('food-cartoon'), alt: 'Cartoon food illustration with a burger, drink, and playful shapes' },
    services: [
      { title: 'Fun Menu Cards', text: 'List meals, snacks, bundles, treats, or food drops in a bold playful layout.' },
      { title: 'Promo Section', text: 'Add limited-time offers, weekly drops, or social media food specials.' },
      { title: 'Easy Contact', text: 'Send customers to email, order instructions, or your checkout link.' }
    ]
  },
  beauty_floral: {
    name: 'Beauty / Hair — Soft Floral',
    category: 'beauty',
    categoryName: 'Beauty / Hair / Salon',
    style: 'floral',
    styleName: 'Soft Floral',
    tone: 'Elegant beauty website',
    defaultPrimary: '#5b213f',
    defaultAccent: '#f472b6',
    headline: 'A soft, polished website for beauty, hair, and confidence.',
    description: 'A stylish layout for salons, hair collections, makeup artists, lash techs, nail artists, and beauty brands.',
    defaultPages: ['Home', 'Services', 'Prices', 'Gallery', 'Booking', 'Contact'],
    art: { icon: '🌸', label: 'Beauty Bloom Showcase', details: 'Services • Prices • Booking', image: art('beauty-floral'), alt: 'Floral beauty illustration with soft flowers and salon-style accents' },
    services: [
      { title: 'Beauty Services', text: 'Add hair, lashes, nails, makeup, beauty products, or appointment services.' },
      { title: 'Price List', text: 'Show starting prices, packages, add-ons, or service details before booking.' },
      { title: 'Booking Details', text: 'Guide clients to book, email, message, or view your social media.' }
    ]
  },
  beauty_luxury: {
    name: 'Beauty / Hair — Luxury Glam',
    category: 'beauty',
    categoryName: 'Beauty / Hair / Salon',
    style: 'luxury',
    styleName: 'Luxury Elegant',
    tone: 'Luxury beauty website',
    defaultPrimary: '#111827',
    defaultAccent: '#d4af37',
    headline: 'Give your beauty brand a polished luxury look.',
    description: 'A high-end beauty layout with glam visuals, service cards, gallery space, and easy booking/contact calls to action.',
    defaultPages: ['Home', 'Services', 'Prices', 'Gallery', 'Testimonials', 'Booking', 'Contact'],
    art: { icon: '💄', label: 'Luxury Beauty Board', details: 'Glam Services • Gallery • Booking', image: art('beauty-luxury'), alt: 'Luxury beauty artwork with gold accents and glam cosmetic elements' },
    services: [
      { title: 'Luxury Services', text: 'Highlight your premium beauty, hair, makeup, or styling offers.' },
      { title: 'Client Gallery', text: 'Show finished looks, transformations, or portfolio examples.' },
      { title: 'Book the Look', text: 'Make it easy for clients to request appointments or ask questions.' }
    ]
  },
  realestate_buildings: {
    name: 'Real Estate / Investor — Building Trust',
    category: 'realestate',
    categoryName: 'Real Estate / Investor',
    style: 'realistic',
    styleName: 'Realistic Professional',
    tone: 'Investor trust website',
    defaultPrimary: '#12312b',
    defaultAccent: '#d4af37',
    headline: 'Make your property, investment, or real estate brand look official.',
    description: 'A professional website for real estate groups, investor education, property services, agents, and portfolio-style trust pages.',
    defaultPages: ['Home', 'About', 'Services', 'Resources', 'Testimonials', 'Contact'],
    art: { icon: '🏢', label: 'Property Trust Panel', details: 'Buildings • Resources • Leads', image: art('realestate-buildings'), alt: 'Realistic building and skyline illustration for real estate websites' },
    services: [
      { title: 'Real Estate Services', text: 'Explain your property, investment, buying, selling, or education services.' },
      { title: 'Investor Resources', text: 'Add guides, products, market education, property highlights, or learning sections.' },
      { title: 'Lead Contact Area', text: 'Help visitors ask questions, request info, or start the next step.' }
    ]
  },
  realestate_3d: {
    name: 'Real Estate / Investor — 3D Modern Property',
    category: 'realestate',
    categoryName: 'Real Estate / Investor',
    style: '3d',
    styleName: '3D Modern',
    tone: 'Modern property website',
    defaultPrimary: '#172554',
    defaultAccent: '#38bdf8',
    headline: 'A modern property website with clean investor confidence.',
    description: 'A sharper 3D-inspired real estate layout for property showcases, investment groups, home service offers, and education products.',
    defaultPages: ['Home', 'Services', 'Resources', 'Gallery', 'FAQ', 'Contact'],
    art: { icon: '🏘️', label: '3D Property Showcase', details: 'Homes • Charts • Contact', image: art('realestate-3d'), alt: '3D-style property illustration with modern buildings and cards' },
    services: [
      { title: 'Property Highlights', text: 'Show properties, services, resources, or benefits in a polished layout.' },
      { title: 'Investor Education', text: 'Explain guides, courses, newsletters, or beginner real estate resources.' },
      { title: 'Contact & Leads', text: 'Give visitors a simple way to ask questions or request information.' }
    ]
  },
  wellness_floral: {
    name: 'Wellness / Health — Flowers & Herbs',
    category: 'wellness',
    categoryName: 'Wellness / Health Product',
    style: 'floral',
    styleName: 'Soft Floral',
    tone: 'Calm wellness website',
    defaultPrimary: '#31572c',
    defaultAccent: '#84cc16',
    headline: 'A calming website for wellness products, trackers, and natural living.',
    description: 'A trusted layout for wellness guides, digital health products, journals, trackers, natural remedies, and lifestyle brands.',
    defaultPages: ['Home', 'About', 'Products', 'Testimonials', 'FAQ', 'Contact'],
    art: { icon: '🌿', label: 'Wellness Bloom Card', details: 'Benefits • Products • FAQ', image: art('wellness-floral'), alt: 'Soft wellness image with flowers, herbs, and calm natural shapes' },
    services: [
      { title: 'Wellness Benefits', text: 'Explain the benefits, habits, education, trackers, or natural living support.' },
      { title: 'Product Details', text: 'Show what customers receive, how to use it, and why it helps.' },
      { title: 'Trust & FAQ', text: 'Answer common wellness questions and guide visitors to purchase or contact you.' }
    ]
  },
  wellness_minimal: {
    name: 'Wellness / Health — Clean Minimal',
    category: 'wellness',
    categoryName: 'Wellness / Health Product',
    style: 'minimal',
    styleName: 'Minimal Clean',
    tone: 'Clean wellness website',
    defaultPrimary: '#164e63',
    defaultAccent: '#2dd4bf',
    headline: 'Simple, clean wellness information customers can trust.',
    description: 'A minimal layout for health education, journals, wellness apps, guides, and small product pages.',
    defaultPages: ['Home', 'Products', 'FAQ', 'Contact'],
    art: { icon: '💧', label: 'Clean Wellness Layout', details: 'Simple • Calm • Helpful', image: art('wellness-minimal'), alt: 'Clean minimal wellness illustration with water, leaves, and soft cards' },
    services: [
      { title: 'Simple Benefits', text: 'Keep the main wellness benefits clear and easy to read.' },
      { title: 'Product Information', text: 'Explain what is included and how customers can use the product.' },
      { title: 'Helpful Answers', text: 'Add FAQ details and a clear contact button.' }
    ]
  },
  local_3d: {
    name: 'Local Services — 3D Modern',
    category: 'localservices',
    categoryName: 'Local Services',
    style: '3d',
    styleName: '3D Modern',
    tone: 'Local service website',
    defaultPrimary: '#1f3153',
    defaultAccent: '#f59e0b',
    headline: 'Professional services made simple for your local community.',
    description: 'A clean service website for businesses that need trust, service details, and easy contact options.',
    defaultPages: ['Home', 'Services', 'Service Area', 'Testimonials', 'Contact'],
    art: { icon: '🧰', label: 'Service Setup Board', details: 'Services • Reviews • Contact', image: art('local-3d'), alt: '3D-style local service artwork with tools, map pin, and service cards' },
    services: [
      { title: 'Main Services', text: 'List the services your customer offers and what each one includes.' },
      { title: 'Service Area', text: 'Tell visitors where the business works and who it serves.' },
      { title: 'Quick Contact', text: 'Make it easy for people to email, book, or ask questions.' }
    ]
  },
  local_realistic: {
    name: 'Local Services — Realistic Professional',
    category: 'localservices',
    categoryName: 'Local Services',
    style: 'realistic',
    styleName: 'Realistic Professional',
    tone: 'Trust-first local website',
    defaultPrimary: '#312e81',
    defaultAccent: '#fb923c',
    headline: 'A trustworthy website for local service providers.',
    description: 'A practical professional layout for home services, repair services, mobile services, and local business brands.',
    defaultPages: ['Home', 'Services', 'About', 'Testimonials', 'Contact'],
    art: { icon: '📍', label: 'Local Business Proof', details: 'Services • Trust • Location', image: art('local-realistic'), alt: 'Realistic local business illustration with storefront, map pin, and service cards' },
    services: [
      { title: 'Service Details', text: 'Explain what the business does in plain language.' },
      { title: 'Customer Trust', text: 'Add reviews, experience, guarantees, or service promises.' },
      { title: 'Contact Steps', text: 'Tell visitors how to request service or ask questions.' }
    ]
  },
  digital_bold: {
    name: 'Digital Products — Bold Sales Page',
    category: 'digitalproducts',
    categoryName: 'Digital Product Seller',
    style: 'bold',
    styleName: 'Bold Colorful',
    tone: 'Digital product sales page',
    defaultPrimary: '#4c1d95',
    defaultAccent: '#f97316',
    headline: 'Turn your digital product into a clear sales page.',
    description: 'A high-energy landing page for ebooks, apps, downloads, courses, recipe products, templates, and creator tools.',
    defaultPages: ['Home', 'Products', 'FAQ', 'Testimonials', 'Contact'],
    art: { icon: '💻', label: 'Digital Product Stack', details: 'Benefits • Bonuses • Buy Now', image: art('digital-bold'), alt: 'Bold digital product artwork with app cards, download buttons, and colorful shapes' },
    services: [
      { title: 'Product Benefits', text: 'Explain what your product helps the customer do or understand.' },
      { title: 'What’s Included', text: 'List downloads, features, guides, bonuses, pages, or access details.' },
      { title: 'Buy Now Section', text: 'Send customers to Gumroad, checkout, or a purchase link.' }
    ]
  },
  digital_3d: {
    name: 'Digital Products — 3D Creator Tool',
    category: 'digitalproducts',
    categoryName: 'Digital Product Seller',
    style: '3d',
    styleName: '3D Modern',
    tone: 'Creator product website',
    defaultPrimary: '#0f172a',
    defaultAccent: '#22d3ee',
    headline: 'Show your app, tool, or download with a modern 3D look.',
    description: 'A polished layout for software-style products, HTML apps, planners, digital bundles, and educational tools.',
    defaultPages: ['Home', 'Products', 'Gallery', 'FAQ', 'Contact'],
    art: { icon: '📱', label: '3D App Preview', details: 'Screens • Features • Checkout', image: art('digital-3d'), alt: '3D digital product mockup with phone, app cards, and download icons' },
    services: [
      { title: 'Feature Cards', text: 'Show the most important features or benefits.' },
      { title: 'Product Preview', text: 'Explain what customers see, use, or download after purchase.' },
      { title: 'Checkout Direction', text: 'Add a clear button or instruction for how to buy.' }
    ]
  },
  nonprofit_warm: {
    name: 'Nonprofit / Community — Warm Mission',
    category: 'nonprofit',
    categoryName: 'Nonprofit / Community',
    style: 'warm',
    styleName: 'Warm Cozy',
    tone: 'Community mission website',
    defaultPrimary: '#155e75',
    defaultAccent: '#22c55e',
    headline: 'A welcoming website for your mission, programs, and community impact.',
    description: 'A mission-based site for community programs, shelters, youth groups, outreach, events, and local support organizations.',
    defaultPages: ['Home', 'About', 'Programs', 'Donate', 'Events', 'Contact'],
    art: { icon: '🤝', label: 'Community Impact Board', details: 'Mission • Programs • Support', image: art('nonprofit-warm'), alt: 'Warm nonprofit community illustration with helping hands, people, and heart shapes' },
    services: [
      { title: 'Mission Story', text: 'Tell visitors what the organization stands for and why the work matters.' },
      { title: 'Programs', text: 'Explain services, outreach, community events, or volunteer needs.' },
      { title: 'Support Options', text: 'Add donation, volunteer, partner, or contact information.' }
    ]
  },
  nonprofit_bold: {
    name: 'Nonprofit / Community — Bold Action',
    category: 'nonprofit',
    categoryName: 'Nonprofit / Community',
    style: 'bold',
    styleName: 'Bold Colorful',
    tone: 'Action-based nonprofit website',
    defaultPrimary: '#7c2d12',
    defaultAccent: '#22c55e',
    headline: 'Make your community message clear, bold, and easy to support.',
    description: 'A stronger call-to-action layout for programs, outreach projects, community campaigns, and support pages.',
    defaultPages: ['Home', 'Programs', 'Donate', 'Events', 'FAQ', 'Contact'],
    art: { icon: '📣', label: 'Community Action Banner', details: 'Programs • Donate • Events', image: art('nonprofit-bold'), alt: 'Bold community action illustration with signs, hearts, and event cards' },
    services: [
      { title: 'Action Message', text: 'Explain the problem, mission, or community need.' },
      { title: 'Programs & Events', text: 'Share outreach programs, calendar details, or support events.' },
      { title: 'Donate or Help', text: 'Guide visitors to give, volunteer, share, or contact the organization.' }
    ]
  },
  portfolio_cinematic: {
    name: 'Portfolio / Film — Cinematic',
    category: 'portfolio',
    categoryName: 'Portfolio / Film / Creator',
    style: 'cinematic',
    styleName: 'Cinematic',
    tone: 'Creator showcase website',
    defaultPrimary: '#111827',
    defaultAccent: '#a855f7',
    headline: 'Showcase your work, story, and creative brand.',
    description: 'A visual portfolio website for filmmakers, creators, artists, writers, performers, and production companies.',
    defaultPages: ['Home', 'About', 'Projects', 'Portfolio', 'Gallery', 'Contact'],
    art: { icon: '🎬', label: 'Creator Spotlight Wall', details: 'Projects • Reels • Booking', image: art('portfolio-cinematic'), alt: 'Cinematic creator artwork with film reel, stage lights, and portfolio cards' },
    services: [
      { title: 'Featured Work', text: 'Show films, projects, scripts, videos, art, products, or creative services.' },
      { title: 'Creator Story', text: 'Explain who you are, what you create, and what makes your brand stand out.' },
      { title: 'Booking / Contact', text: 'Give collaborators, clients, or fans a clear way to reach out.' }
    ]
  },
  portfolio_cartoon: {
    name: 'Portfolio / Film — Cartoon Creative',
    category: 'portfolio',
    categoryName: 'Portfolio / Film / Creator',
    style: 'cartoon',
    styleName: 'Cartoon Fun',
    tone: 'Playful creator website',
    defaultPrimary: '#581c87',
    defaultAccent: '#facc15',
    headline: 'A creative website with personality, projects, and fun visuals.',
    description: 'A playful portfolio for creators, entertainers, character brands, comics, visual storytellers, and media pages.',
    defaultPages: ['Home', 'Projects', 'Gallery', 'Events', 'Contact'],
    art: { icon: '🎨', label: 'Creative Cartoon Board', details: 'Projects • Art • Events', image: art('portfolio-cartoon'), alt: 'Cartoon creative portfolio illustration with paint, camera, and playful shapes' },
    services: [
      { title: 'Creative Projects', text: 'Showcase what you make, write, film, design, or perform.' },
      { title: 'Gallery / Reel', text: 'Give visitors a visual look at the work or brand.' },
      { title: 'Event / Booking', text: 'Add event info, booking steps, or contact details.' }
    ]
  },
  cleaning_realistic: {
    name: 'Cleaning / Home Services — Realistic Clean',
    category: 'cleaning',
    categoryName: 'Cleaning / Home Services',
    style: 'realistic',
    styleName: 'Realistic Professional',
    tone: 'Cleaning service website',
    defaultPrimary: '#0f766e',
    defaultAccent: '#38bdf8',
    headline: 'A fresh website for cleaning, organizing, and home services.',
    description: 'A clean professional layout for residential cleaning, mobile cleaning, home help, organizing, and local service teams.',
    defaultPages: ['Home', 'Services', 'Packages', 'Before & After', 'Testimonials', 'Contact'],
    art: { icon: '🧽', label: 'Fresh Clean Service Board', details: 'Packages • Before & After • Contact', image: art('cleaning-realistic'), alt: 'Realistic cleaning service artwork with supplies, sparkling home, and service cards' },
    services: [
      { title: 'Cleaning Packages', text: 'Describe basic, deep clean, move-out, recurring, or special cleaning offers.' },
      { title: 'Before & After', text: 'Show results, photos, transformations, or cleaning examples.' },
      { title: 'Book Service', text: 'Make it easy for customers to request cleaning help.' }
    ]
  },
  cleaning_cartoon: {
    name: 'Cleaning / Home Services — Cartoon Sparkle',
    category: 'cleaning',
    categoryName: 'Cleaning / Home Services',
    style: 'cartoon',
    styleName: 'Cartoon Fun',
    tone: 'Fun cleaning service website',
    defaultPrimary: '#0369a1',
    defaultAccent: '#facc15',
    headline: 'Sparkly clean service with a friendly, fun look.',
    description: 'A bright cleaning website for small teams, mobile cleaning, family businesses, and playful local brands.',
    defaultPages: ['Home', 'Services', 'Packages', 'Gallery', 'FAQ', 'Contact'],
    art: { icon: '✨', label: 'Sparkle Service Scene', details: 'Clean • Shine • Book', image: art('cleaning-cartoon'), alt: 'Cartoon cleaning art with bubbles, broom, sparkles, and happy home shapes' },
    services: [
      { title: 'Sparkle Packages', text: 'List service packages or cleaning bundles.' },
      { title: 'Friendly Details', text: 'Explain what is included, service areas, and customer expectations.' },
      { title: 'Fast Contact', text: 'Tell customers how to book, email, or ask questions.' }
    ]
  },
  coaching_minimal: {
    name: 'Coaching / Consulting — Clean Expert',
    category: 'coaching',
    categoryName: 'Coaching / Consulting',
    style: 'minimal',
    styleName: 'Minimal Clean',
    tone: 'Professional coaching website',
    defaultPrimary: '#1e293b',
    defaultAccent: '#f59e0b',
    headline: 'A clear website for coaching, consulting, and client services.',
    description: 'A clean layout for coaches, consultants, advisors, educators, mentors, and appointment-based professionals.',
    defaultPages: ['Home', 'About', 'Services', 'Packages', 'Testimonials', 'Booking', 'Contact'],
    art: { icon: '📘', label: 'Expert Service Framework', details: 'Programs • Packages • Booking', image: art('coaching-minimal'), alt: 'Minimal coaching illustration with notebooks, calendar, and strategy cards' },
    services: [
      { title: 'Coaching Services', text: 'Explain sessions, programs, packages, or consulting offers.' },
      { title: 'Client Results', text: 'Add testimonials, transformation points, or what clients can expect.' },
      { title: 'Book a Session', text: 'Send visitors to email, booking, consultation, or next steps.' }
    ]
  },
  coaching_luxury: {
    name: 'Coaching / Consulting — Luxury Advisor',
    category: 'coaching',
    categoryName: 'Coaching / Consulting',
    style: 'luxury',
    styleName: 'Luxury Elegant',
    tone: 'Premium advisor website',
    defaultPrimary: '#1c1917',
    defaultAccent: '#d4af37',
    headline: 'Position your expertise with a premium professional website.',
    description: 'A polished high-trust layout for premium consultants, business coaches, advisors, and service professionals.',
    defaultPages: ['Home', 'About', 'Services', 'Packages', 'Testimonials', 'Booking', 'Contact'],
    art: { icon: '🏆', label: 'Premium Advisor Desk', details: 'Expertise • Packages • Contact', image: art('coaching-luxury'), alt: 'Luxury coaching and consulting artwork with gold accents and strategy boards' },
    services: [
      { title: 'Premium Services', text: 'Describe high-value coaching, consulting, or advisory packages.' },
      { title: 'Proof & Trust', text: 'Highlight experience, outcomes, testimonials, or credibility.' },
      { title: 'Book / Contact', text: 'Make the next step easy and professional.' }
    ]
  },
  kids_cartoon: {
    name: 'Kids / Party / Fun — Cartoon Bright',
    category: 'kids',
    categoryName: 'Kids / Party / Fun',
    style: 'cartoon',
    styleName: 'Cartoon Fun',
    tone: 'Fun event website',
    defaultPrimary: '#be123c',
    defaultAccent: '#22c55e',
    headline: 'A bright, fun website for parties, kids, events, and playful brands.',
    description: 'A cheerful layout for party planners, kids brands, event pages, activity services, games, and family-friendly offers.',
    defaultPages: ['Home', 'Services', 'Packages', 'Events', 'Gallery', 'FAQ', 'Contact'],
    art: { icon: '🎈', label: 'Party Fun Scene', details: 'Events • Packages • Gallery', image: art('kids-cartoon'), alt: 'Cartoon party illustration with balloons, confetti, and fun event cards' },
    services: [
      { title: 'Party Packages', text: 'List events, party options, entertainment, games, or activity bundles.' },
      { title: 'Event Details', text: 'Share dates, services, add-ons, locations, or what families can expect.' },
      { title: 'Book the Fun', text: 'Guide visitors to contact, book, or ask questions.' }
    ]
  },
  kids_bold: {
    name: 'Kids / Party / Fun — Bold Color Pop',
    category: 'kids',
    categoryName: 'Kids / Party / Fun',
    style: 'bold',
    styleName: 'Bold Colorful',
    tone: 'Colorful family website',
    defaultPrimary: '#7c3aed',
    defaultAccent: '#fb7185',
    headline: 'Colorful pages for fun brands, games, events, and kids products.',
    description: 'A bold playful layout for family services, children’s products, event promos, games, and fun community pages.',
    defaultPages: ['Home', 'Products', 'Events', 'Gallery', 'FAQ', 'Contact'],
    art: { icon: '🎮', label: 'Fun Brand Pop', details: 'Games • Events • Products', image: art('kids-bold'), alt: 'Bold colorful kids and fun brand artwork with games, toys, and bright shapes' },
    services: [
      { title: 'Fun Offers', text: 'Show games, products, party offers, or activity services.' },
      { title: 'Events & Gallery', text: 'Highlight pictures, event info, or playful examples.' },
      { title: 'Ask / Book', text: 'Make contact and booking simple for parents or customers.' }
    ]
  },
  shop_luxury: {
    name: 'Online Shop / Boutique — Luxury Product',
    category: 'shop',
    categoryName: 'Online Shop / Boutique',
    style: 'luxury',
    styleName: 'Luxury Elegant',
    tone: 'Boutique product website',
    defaultPrimary: '#0f172a',
    defaultAccent: '#d4af37',
    headline: 'A polished product website for boutiques, bundles, and online shops.',
    description: 'A stylish shop-style website for products, collections, bundles, digital items, and boutique brands.',
    defaultPages: ['Home', 'Shop', 'Products', 'Gallery', 'FAQ', 'Contact'],
    art: { icon: '🛍️', label: 'Boutique Product Display', details: 'Shop • Products • Contact', image: art('shop-luxury'), alt: 'Luxury online shop illustration with product boxes, shopping bag, and gold accents' },
    services: [
      { title: 'Featured Products', text: 'Show best sellers, bundles, collections, or digital/physical products.' },
      { title: 'Product Benefits', text: 'Explain what makes the products useful, beautiful, or worth buying.' },
      { title: 'Shop Direction', text: 'Send customers to a checkout link, Gumroad, store page, or contact button.' }
    ]
  },
  shop_realistic: {
    name: 'Online Shop / Boutique — Realistic Storefront',
    category: 'shop',
    categoryName: 'Online Shop / Boutique',
    style: 'realistic',
    styleName: 'Realistic Professional',
    tone: 'Online shop website',
    defaultPrimary: '#78350f',
    defaultAccent: '#f59e0b',
    headline: 'Create a simple storefront-style website for your products.',
    description: 'A practical shop layout for product sellers, small boutiques, drops, bundles, digital goods, and collections.',
    defaultPages: ['Home', 'Products', 'Shop', 'Gallery', 'Contact'],
    art: { icon: '📦', label: 'Storefront Product Shelf', details: 'Products • Bundles • Checkout', image: art('shop-realistic'), alt: 'Realistic storefront illustration with product shelf, boxes, and shopping cards' },
    services: [
      { title: 'Product Showcase', text: 'Add product names, details, prices, or collections.' },
      { title: 'Bundle Details', text: 'Explain packages, limited drops, or customer favorites.' },
      { title: 'Buy / Contact', text: 'Send visitors to checkout, an online store, or email.' }
    ]
  },

  // Legacy aliases keep older published sites from breaking.
  local: {} as TemplateDefinition,
  restaurant: {} as TemplateDefinition,
  realestate: {} as TemplateDefinition,
  wellness: {} as TemplateDefinition,
  portfolio: {} as TemplateDefinition,
  nonprofit: {} as TemplateDefinition
} as Record<string, TemplateDefinition>;

templates.local = { ...templates.local_3d, name: 'Local Business — Legacy', featured: false };
templates.restaurant = { ...templates.food_realistic, name: 'Restaurant / Cookbook — Legacy', featured: false };
templates.realestate = { ...templates.realestate_buildings, name: 'Real Estate / Investor — Legacy', featured: false };
templates.wellness = { ...templates.wellness_floral, name: 'Wellness Product — Legacy', featured: false };
templates.portfolio = { ...templates.portfolio_cinematic, name: 'Film / Portfolio — Legacy', featured: false };
templates.nonprofit = { ...templates.nonprofit_warm, name: 'Nonprofit / Community — Legacy', featured: false };

export type TemplateKey = keyof typeof templates;

export const templateCatalog = Object.entries(templates)
  .filter(([, item]) => item.featured !== false)
  .map(([key, item]) => ({ key: key as TemplateKey, ...item }));

export const templateCategories = [
  { key: 'food', name: 'Restaurant / Food', description: 'Menus, specials, recipes, catering, food products' },
  { key: 'beauty', name: 'Beauty / Hair / Salon', description: 'Services, prices, gallery, booking' },
  { key: 'realestate', name: 'Real Estate / Investor', description: 'Property, investor resources, leads' },
  { key: 'wellness', name: 'Wellness / Health', description: 'Products, benefits, FAQ, trust' },
  { key: 'localservices', name: 'Local Services', description: 'Services, service area, reviews, contact' },
  { key: 'digitalproducts', name: 'Digital Products', description: 'Sales pages, downloads, apps, Gumroad offers' },
  { key: 'nonprofit', name: 'Nonprofit / Community', description: 'Mission, programs, donations, events' },
  { key: 'portfolio', name: 'Portfolio / Film / Creator', description: 'Projects, reels, gallery, booking' },
  { key: 'cleaning', name: 'Cleaning / Home Services', description: 'Packages, before/after, testimonials' },
  { key: 'coaching', name: 'Coaching / Consulting', description: 'Services, packages, booking, proof' },
  { key: 'kids', name: 'Kids / Party / Fun', description: 'Events, games, parties, colorful brands' },
  { key: 'shop', name: 'Online Shop / Boutique', description: 'Products, shop, gallery, checkout direction' }
] as const;

export const templateStyleNames: Record<TemplateStyleKey, string> = {
  '3d': '3D Modern',
  realistic: 'Realistic Professional',
  cartoon: 'Cartoon Fun',
  floral: 'Soft Floral',
  luxury: 'Luxury Elegant',
  bold: 'Bold Colorful',
  warm: 'Warm Cozy',
  minimal: 'Minimal Clean',
  cinematic: 'Cinematic'
};

export const templateThemeClasses: Record<string, string> = Object.fromEntries(
  Object.keys(templates).map(key => [key, `template-purpose template-${templates[key].category} style-${templates[key].style}`])
);

export const templateAccentWords: Record<string, string> = Object.fromEntries(
  Object.keys(templates).map(key => [key, templates[key].categoryName])
);

export const pageCopy: Record<string, { title: string; body: string }> = {
  About: { title: 'About Us', body: 'Share the story behind the business, who it serves, and why customers can trust the brand.' },
  Services: { title: 'Services', body: 'Break down the main services, what each service includes, and how customers can get started.' },
  Products: { title: 'Products', body: 'Showcase digital products, physical products, packages, downloads, bundles, or featured offers.' },
  Menu: { title: 'Menu', body: 'Add featured meals, menu categories, prices, specials, ordering details, or food product information.' },
  Specials: { title: 'Specials', body: 'Share limited-time offers, weekly specials, discounts, seasonal promos, or featured products.' },
  Prices: { title: 'Prices', body: 'List starting prices, package prices, add-ons, service ranges, or quote instructions.' },
  Packages: { title: 'Packages', body: 'Explain packages, bundles, tiers, what is included, and which option is best for different customers.' },
  Booking: { title: 'Booking', body: 'Tell visitors how to book, request a service, reserve a spot, schedule a call, or send an appointment request.' },
  Gallery: { title: 'Gallery', body: 'Display photos, examples, portfolio samples, before-and-after images, or visual proof of the work.' },
  Testimonials: { title: 'Testimonials', body: 'Highlight customer reviews, success stories, feedback, or social proof that builds trust.' },
  Contact: { title: 'Contact', body: 'Make it easy for visitors to reach the business by email, booking link, or contact form.' },
  FAQ: { title: 'Frequently Asked Questions', body: 'Answer common questions about services, pricing, turnaround time, delivery, booking, or support.' },
  Shop: { title: 'Shop', body: 'Send visitors to products, bundles, checkout links, Gumroad pages, or online store options.' },
  Events: { title: 'Events', body: 'Share upcoming events, parties, workshops, community dates, launches, or appearances.' },
  Programs: { title: 'Programs', body: 'Explain programs, services, outreach, classes, events, or community support offerings.' },
  Donate: { title: 'Donate / Support', body: 'Add donation instructions, sponsor details, volunteer options, or ways visitors can support the mission.' },
  Projects: { title: 'Projects', body: 'Feature creative projects, case studies, videos, films, products, client work, or portfolio highlights.' },
  Portfolio: { title: 'Portfolio', body: 'Show examples, creative work, project samples, reels, designs, photos, or accomplishments.' },
  Resources: { title: 'Resources', body: 'Add guides, learning materials, links, downloads, newsletters, or helpful information.' },
  'Service Area': { title: 'Service Area', body: 'Tell customers what cities, counties, neighborhoods, or regions the business serves.' },
  'Before & After': { title: 'Before & After', body: 'Show transformations, progress, results, or examples that prove the service or product works.' }
};

export const defaultOfferTitle = 'What I Offer';

export function safeTemplateKey(value: any): TemplateKey {
  const key = String(value || '').trim();
  return templates[key] ? key : 'local_3d';
}

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

export function defaultPagesForTemplate(templateKey: TemplateKey | string, plan: PlanKey = 'starter') {
  const template = templates[safeTemplateKey(templateKey)];
  const defaults = normalizePages(template.defaultPages || ['Home']);
  if (plan === 'free' || plan === 'starter') return ['Home'];
  if (plan === 'business') return defaults.slice(0, plans.business.maxPages).includes('Home') ? defaults.slice(0, plans.business.maxPages) : ['Home', ...defaults.filter(p => p !== 'Home').slice(0, plans.business.maxPages - 1)];
  return defaults;
}

export function sectionId(page: string) {
  return String(page || 'home').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'home';
}

export function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 50) || 'customer-site';
}

export function normalizeServiceCards(value: any, templateKey: TemplateKey | string = 'local_3d'): ServiceCard[] {
  let cards: any[] | null = null;
  if (Array.isArray(value)) cards = value;
  else if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) cards = parsed;
    } catch {}
  }

  const safeKey = safeTemplateKey(templateKey);
  const fallback = templates[safeKey].services;
  const source = cards && cards.length ? cards : fallback;
  const cleaned = source.slice(0, 6).map((card: any, index: number) => ({
    title: String(card?.title || fallback[index % fallback.length]?.title || `Offer ${index + 1}`).trim(),
    text: String(card?.text || card?.body || fallback[index % fallback.length]?.text || 'Describe this offer, service, product, or customer benefit.').trim()
  })).filter(card => card.title || card.text);

  return cleaned.length ? cleaned : fallback.map(card => ({ ...card }));
}

export function normalizePageContent(value: any, pages: string[] = pageOptions): PageContentMap {
  let parsed: Record<string, any> = {};
  if (value && typeof value === 'object' && !Array.isArray(value)) parsed = value;
  else if (typeof value === 'string' && value.trim()) {
    try {
      const maybe = JSON.parse(value);
      if (maybe && typeof maybe === 'object' && !Array.isArray(maybe)) parsed = maybe;
    } catch {}
  }

  const result: PageContentMap = {};
  const pageList = normalizePages(pages).filter(page => page !== 'Home');
  for (const page of pageList) {
    const fallback = pageCopy[page] || { title: page, body: 'Add custom information for this page.' };
    const item = parsed[page] || {};
    result[page] = {
      title: String(item.title || fallback.title || page),
      body: String(item.body || fallback.body || '')
    };
  }
  return result;
}
