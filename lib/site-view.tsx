import {
  pageCopy,
  sectionId,
  templateAccentWords,
  templateThemeClasses,
  templates,
  type TemplateKey,
  normalizePages
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
};

function safeTemplate(value: any): TemplateKey {
  return value && templates[value as TemplateKey] ? value as TemplateKey : 'local';
}

export function CustomerSiteView(props: SiteViewProps) {
  const source = props.site || props;
  const templateKey = safeTemplate(props.template || source.template);
  const template = templates[templateKey];
  const pages = normalizePages(props.pages || source.pages || ['Home']);
  const businessName = props.businessName || source.businessName || source.business_name || 'My Business Name';
  const headline = props.headline || source.headline || template.headline;
  const description = props.description || source.description || template.description;
  const primaryColor = props.primaryColor || source.primaryColor || '#20172f';
  const accentColor = props.accentColor || source.accentColor || '#c46a2d';
  const phone = props.phone || source.phone || '';
  const email = props.email || source.email || '';
  const themeClass = templateThemeClasses[templateKey];

  return <div className={`site-preview published-site ${themeClass}`} style={{marginTop: 18, textAlign: 'left'} as any}>
    <header className="site-header" style={{background: primaryColor, color: 'white'}}>
      <a href="#home" className="site-brand-link"><strong>{businessName}</strong></a>
      <nav className="site-top-links" aria-label="Website navigation">
        {pages.map(page => <a key={page} href={`#${sectionId(page)}`}>{page}</a>)}
      </nav>
    </header>

    <section id="home" className="site-hero" style={{background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})`, color: 'white'}}>
      <div className="hero-kicker">{props.previewLabel || templateAccentWords[templateKey]}</div>
      <span className="badge" style={{color: primaryColor}}>{template.name}</span>
      <h1>{headline}</h1>
      <p style={{color:'rgba(255,255,255,.9)'}}>{description}</p>
      <div className="hero-actions">
        {email ? <a className="btn gold" href={`mailto:${email}`}>Contact Now</a> : <a className="btn gold" href="#contact">Contact Now</a>}
        {phone && <a className="btn secondary hero-phone" href={`tel:${phone.replace(/[^0-9+]/g, '')}`}>{phone}</a>}
      </div>
    </section>

    <section id="services" className="site-section services-section">
      <div className="section-eyebrow">{template.tone}</div>
      <h2>What We Offer</h2>
      <div className="service-grid">
        {template.services.map((s: any) => <div className="service-card" key={s.title}><h3>{s.title}</h3><p>{s.text}</p></div>)}
      </div>
    </section>

    {pages.filter(page => page !== 'Home' && page !== 'Services').map(page => {
      const copy = pageCopy[page] || { title: page, body: 'This page can be customized with customer-specific content.' };
      return <section className="site-section extra-content-section" id={sectionId(page)} key={page}>
        <div className="section-eyebrow">{page}</div>
        <h2>{copy.title}</h2>
        <p>{copy.body}</p>
        {page === 'Contact' && <div className="contact-panel">
          <strong>{businessName}</strong>
          <span>{phone || 'Phone can be added in the editor'}</span>
          <span>{email || 'Email can be added in the editor'}</span>
        </div>}
      </section>;
    })}

    {!pages.includes('Contact') && <section className="site-section extra-content-section" id="contact">
      <div className="section-eyebrow">Contact</div>
      <h2>Contact {businessName}</h2>
      <p>Ready to learn more? Reach out using the contact details below.</p>
      <div className="contact-panel">
        <strong>{businessName}</strong>
        <span>{phone || 'Phone can be added in the editor'}</span>
        <span>{email || 'Email can be added in the editor'}</span>
      </div>
    </section>}

    <footer className="site-footer"><strong>{businessName}</strong><br />{phone || ''} {phone && email ? '•' : ''} {email || ''}</footer>
  </div>;
}
