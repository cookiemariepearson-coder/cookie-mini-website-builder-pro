import Link from 'next/link';

export default function HowItWorksPage() {
  const steps = [
    ['Choose Type & Look', 'Pick the kind of website being created, then choose a visual look such as realistic, floral, luxury, cartoon, 3D, bold, cinematic, or minimal.'],
    ['Enter Website Info', 'Add the business name, email, headline, description, offer boxes, colors, and page wording.'],
    ['Preview While Building', 'Watch the website preview update while the customer changes the content, design, and pages.'],
    ['Publish or Checkout', 'Free users can publish one branded page. Paid users go to Gumroad checkout first, then return to finish publishing.'],
    ['Manage Later', 'Customers can come back through the customer dashboard to edit and republish their website.'],
    ['Promote the Website', 'Use AI Video Studio to create scripts, captions, storyboard notes, and video prompts for social media promotion.']
  ];
  return <main className="container section">
    <nav className="nav launch-nav">
      <Link className="brand brand-link" href="/"><span className="logo">C</span> Cookie Mini Website Builder</Link>
      <div className="navlinks"><Link href="/builder">Create Site</Link><Link href="/pricing">Pricing</Link><Link href="/faq">FAQ</Link><Link href="/contact">Contact</Link></div>
    </nav>
    <section className="card admin-hero">
      <span className="badge">How it works</span>
      <h1>From idea to live website in a guided flow.</h1>
      <p>The builder walks customers through the process so they do not have to start from a blank page.</p>
    </section>
    <section className="grid cards3" style={{marginTop: 22}}>
      {steps.map(([title, text], index) => <div className="card launch-step-card" key={title}>
        <span className="step-number">{index + 1}</span>
        <h2>{title}</h2>
        <p>{text}</p>
      </div>)}
    </section>
    <section className="controls" style={{marginTop: 22}}>
      <Link className="btn gold" href="/builder?plan=free">Start Free</Link>
      <Link className="btn secondary" href="/pricing">View Pricing</Link>
    </section>
  </main>;
}
