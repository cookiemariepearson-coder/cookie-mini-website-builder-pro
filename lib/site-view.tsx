import {
  defaultOfferTitle,
  normalizePageContent,
  normalizePages,
  normalizePlanKey,
  normalizeServiceCards,
  pageCopy,
  sectionId,
  safeTemplateKey,
  templateThemeClasses,
  templates,
  type TemplateKey
} from './templates';

type SiteViewProps = {
  site?: any;
  businessName?: string;
  headline?: string;
  description?: string;
  primaryColor?: string;
  accentColor?: string;
  template?: TemplateKey | string;
  pages?: string[];
  phone?: string;
  email?: string;
  previewLabel?: string;
  plan?: string;
  serviceCards?: any[];
  pageContent?: any;
  offerTitle?: string;
};

function valueOrDefault(value: any, fallback: string) {
  return value === undefined || value === null || String(value).trim() === '' ? fallback : String(value);
}

function parsePageContent(value: any) {
  if (value && typeof value === 'object' && !Array.isArray(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed;
    } catch {}
  }
  return {};
}

export function CustomerSiteView(props: SiteViewProps) {
  const source = props.site || props;
  const templateKey = safeTemplateKey(props.template ?? source.template);
  const template = templates[templateKey];
  const pages = normalizePages(props.pages ?? source.pages ?? ['Home']);
  const planKey = normalizePlanKey(props.plan ?? source.plan);
  const isFree = planKey === 'free';
  const businessName = valueOrDefault(props.businessName ?? source.businessName ?? source.business_name, 'My Business Name');
  const headline = valueOrDefault(props.headline ?? source.headline, template.headline);
  const description = valueOrDefault(props.description ?? source.description, template.description);
  const primaryColor = valueOrDefault(props.primaryColor ?? source.primaryColor, template.defaultPrimary || '#20172f');
  const accentColor = valueOrDefault(props.accentColor ?? source.accentColor, template.defaultAccent || '#c46a2d');
  const phone = valueOrDefault(props.phone ?? source.phone, '');
  const email = valueOrDefault(props.email ?? source.email, '');
  const themeClass = templateThemeClasses[templateKey] || 'template-purpose';
  const contactHref = email ? `mailto:${email}` : '#contact';
  const navPages = pages.includes('Contact') ? pages : [...pages, 'Contact'];
  const rawPageContent = parsePageContent(props.pageContent ?? source.pageContent ?? source.page_content);
  const pageContent = normalizePageContent(rawPageContent, pages);
  const artTitle = valueOrDefault(rawPageContent?._art?.title, template.art.label);
  const artDetails = valueOrDefault(rawPageContent?._art?.details, template.art.details);
  const serviceCards = normalizeServiceCards(props.serviceCards ?? source.serviceCards ?? source.service_cards, templateKey);
  const servicePageContent = rawPageContent.Services || pageContent.Services || pageCopy.Services;
  const serviceSectionTitle = valueOrDefault(props.offerTitle ?? source.offerTitle ?? source.offer_title, servicePageContent?.title || defaultOfferTitle);
  const serviceSectionBody = valueOrDefault(servicePageContent?.body, '');

  const cssVars = {
    marginTop: 18,
    textAlign: 'left',
    '--primary': primaryColor,
    '--accent': accentColor,
    '--hero-primary': primaryColor,
    '--hero-accent': accentColor
  } as any;

  return <div className={`site-preview published-site ${themeClass} ${isFree ? 'free-site-preview' : ''}`} style={cssVars}>
    <header className="site-header" style={{background: primaryColor, color: 'white'}}>
      <a href="#home" className="site-brand-link"><strong>{businessName}</strong></a>
      <nav className="site-top-links" aria-label="Website navigation">
        {navPages.map(page => <a key={page} href={`#${sectionId(page)}`}>{page}</a>)}
      </nav>
    </header>

    <section id="home" className="site-hero" style={{background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})`, color: 'white'}}>
      <div className="hero-content-block">
        {props.previewLabel && <div className="hero-kicker">{props.previewLabel}</div>}
        <div className="template-purpose-pill">{template.categoryName} • {template.styleName}</div>
        <h1>{headline}</h1>
        <p className="hero-description" style={{color:'rgba(255,255,255,.92)'}}>{description}</p>
        <div className="hero-actions">
          <a className="btn gold" href={contactHref}>Contact Now</a>
        </div>
      </div>
      <div className="template-art-card rich-art-card" aria-label="Website artwork">
        <div className="template-art-glow" />
        <img className="template-visual-image" src={template.art.image} alt={template.art.alt} />
        <div className="art-chip-row"><em /><em /><em /></div>
        <strong>{artTitle}</strong>
        <span>{artDetails}</span>
      </div>
    </section>

    <section id="services" className="site-section services-section">
      <div className="section-eyebrow">What is offered</div>
      <h2>{serviceSectionTitle || defaultOfferTitle}</h2>
      {serviceSectionBody && <p className="section-intro">{serviceSectionBody}</p>}
      <div className="service-grid">
        {serviceCards.map((s: any, index: number) => <div className="service-card" key={`${s.title}-${index}`}><h3>{s.title}</h3><p>{s.text}</p></div>)}
      </div>
    </section>

    {pages.filter(page => page !== 'Home' && page !== 'Services').map(page => {
      const copy = pageContent[page] || pageCopy[page] || { title: page, body: 'This page can be customized with customer-specific content.' };
      return <section className="site-section extra-content-section" id={sectionId(page)} key={page}>
        <div className="section-eyebrow">{page}</div>
        <h2>{copy.title}</h2>
        <p>{copy.body}</p>
        {page === 'Gallery' && <div className="visual-gallery-strip"><img src={template.art.image} alt="" /><div /><div /></div>}
        {page === 'Contact' && <div className="contact-panel">
          <strong>{businessName}</strong>
          {email && <a href={`mailto:${email}`}>{email}</a>}
          {phone && <span>{phone}</span>}
          {!email && !phone && <span>Contact information can be added in the editor.</span>}
        </div>}
      </section>;
    })}

    {!pages.includes('Contact') && <section className="site-section extra-content-section" id="contact">
      <div className="section-eyebrow">Contact</div>
      <h2>Contact {businessName}</h2>
      <p>Ready to learn more? Use the contact button or details below to reach the business.</p>
      <div className="contact-panel">
        <strong>{businessName}</strong>
        {email && <a href={`mailto:${email}`}>{email}</a>}
        {phone && <span>{phone}</span>}
        {!email && !phone && <span>Contact information can be added in the editor.</span>}
      </div>
    </section>}

    <footer className="site-footer">
      <strong>{businessName}</strong>{email ? <><br /><a href={`mailto:${email}`}>{email}</a></> : null}
      {isFree && <div className="free-branding-badge">Built with Cookie Mini Website Builder • Upgrade to remove this badge</div>}
    </footer>
  </div>;
}
