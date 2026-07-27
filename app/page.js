import Link from 'next/link';
import Nav from '../lib/Nav';
import OwnerFooter from '../lib/OwnerFooter';

const planTiles = [
  ['Free Launch Page', '$0', 'Up to 3 selected sections', '1 action button'],
  ['Starter Pro', '$19/mo', 'Up to 4 selected sections', '2 action buttons + media uploads'],
  ['Business', '$30/mo', 'Up to 6 selected sections', '4 action buttons + AI Video Studio'],
  ['Premium', '$50/mo', 'All built-in sections', '8 action buttons + strongest AI Video Studio'],
  ['Extra Page Add-On', '$10/mo', 'Per page/section space', 'Grow when you need more']
];

const faqs = [
  {
    question: 'What does Cookie Digital Creations offer?',
    answer: 'Cookie Digital Creations provides website-building tools, done-for-you website services, branding and promotional support, and digital products for creators and small businesses.'
  },
  {
    question: 'Can I build my own website?',
    answer: 'Yes. The Cookie Mini Website Builder helps you choose a business style, add your information, preview your page, and prepare a clear online home for your brand.'
  },
  {
    question: 'Can Cookie Digital Creations build the website for me?',
    answer: 'Yes. Done-for-you website services are available for customers who want help organizing, designing, and publishing their business website.'
  },
  {
    question: 'What information should I have ready?',
    answer: 'Prepare your business name, short description, services or products, contact information, preferred colors, logo or images, links, and the action you want visitors to take.'
  },
  {
    question: 'Will my website work on phones and computers?',
    answer: 'The website service is designed with mobile and desktop visitors in mind. The final site is reviewed at common screen sizes before launch.'
  },
  {
    question: 'What does “AI-ready” mean?',
    answer: 'It means the site uses clear headings, helpful descriptions, organized links, and accurate machine-readable information so customers, search engines, and compatible AI systems can better understand the business. It does not guarantee placement or recommendations.'
  },
  {
    question: 'How do I choose between the builder and done-for-you service?',
    answer: 'Choose the Mini Website Builder if you want to create and update the page yourself. Choose done-for-you service if you want Cookie Digital Creations to organize and build it with you.'
  },
  {
    question: 'How do I get started?',
    answer: 'Select “Start Building Free” to begin on your own, view the done-for-you service options, or email hello@cookiesdigitalcreations.com for help choosing.'
  }
];

const organizationData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Cookie Digital Creations',
  url: 'https://www.cookiesdigitalcreations.com/',
  email: 'hello@cookiesdigitalcreations.com',
  description: 'Website-building tools, done-for-you website services, branding, promotional support, and digital products for creators and small businesses.'
};

const websiteData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Cookie Digital Creations',
  url: 'https://www.cookiesdigitalcreations.com/'
};

const serviceData = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Cookie Digital Creations Website Services',
  provider: {
    '@type': 'Organization',
    name: 'Cookie Digital Creations',
    url: 'https://www.cookiesdigitalcreations.com/'
  },
  serviceType: ['Mini Website Builder', 'Done-for-You Website Services'],
  areaServed: 'US',
  url: 'https://www.cookiesdigitalcreations.com/done-for-you'
};

const faqData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer
    }
  }))
};

export default function Home(){
  return (
    <>
      <Nav />
      <main className="brandLanding">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceData) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }} />

        <section className="brandHero">
          <div>
            <span className="kicker">Cookie Digital Creations</span>
            <h1>Build. Book. Sell. Grow.</h1>
            <p>
              Create a polished website that gives visitors a clear way to contact you, book with you,
              order from you, buy from you, request a quote, or get started.
            </p>
            <div className="heroButtonRow">
              <Link className="btn" href="/builder">Start Building Free</Link>
              <Link className="btn dark" href="/pricing">View Website Plans</Link>
              <Link className="btn light" href="/checkout/ai-video">AI Video Studio — $5</Link>
            </div>
          </div>
          <div className="brandHeroMockup" aria-label="Website builder preview">
            <div className="mockBrowser">
              <div className="mockDots"><span></span><span></span><span></span></div>
              <h3>Your Business</h3>
              <h2>A beautiful website that gets customers moving.</h2>
              <div className="mockActionRow">
                <span>Order Now</span>
                <span>Book Appointment</span>
                <span>Request Quote</span>
              </div>
              <div className="mockCards"><span></span><span></span><span></span></div>
            </div>
          </div>
        </section>

        <section className="brandSection">
          <span className="kicker">Customer action tools</span>
          <h2>Every website needs a next step.</h2>
          <p>
            Add buttons for calls, texts, email, booking links, order forms, payment links, menu links,
            Gumroad products, Square, Stripe, Calendly, Google Forms, Jotform, Cash App, or any custom link.
          </p>
          <div className="actionFeatureGrid">
            <div><strong>Order</strong><small>Food, products, services, forms, and custom order links.</small></div>
            <div><strong>Book</strong><small>Appointments, consultations, beauty services, sessions, and events.</small></div>
            <div><strong>Buy</strong><small>Products, digital items, bundles, payment pages, or checkout links.</small></div>
            <div><strong>Contact</strong><small>Call, text, email, inquiry forms, quotes, and customer questions.</small></div>
          </div>
        </section>

        <section className="brandPlanSection">
          <div>
            <span className="kicker">Plans that grow with you</span>
            <h2>Start simple. Add more when your business needs it.</h2>
          </div>
          <div className="brandPlanGrid">
            {planTiles.map(([name, price, detail, actions]) => (
              <article className="brandPlanTile" key={name}>
                <strong>{name}</strong>
                <span>{price}</span>
                <small>{detail}</small>
                <em>{actions}</em>
              </article>
            ))}
          </div>
        </section>

        <section className="brandSplitCta">
          <div>
            <span className="kicker">Need video only?</span>
            <h2>Cookie’s AI Video Studio is available separately.</h2>
            <p>Use the $5 AI Video Studio option for video ideas, hooks, scripts, captions, and scene planning without buying a website plan.</p>
          </div>
          <Link className="btn" href="/checkout/ai-video">Start AI Video Studio</Link>
        </section>

        <section className="wrap cardGrid">
          <div className="card">
            <h2>Purpose-based templates</h2>
            <p>Food, beauty, real estate, wellness, cleaning, coaching, portfolio, shops, nonprofit, and more.</p>
          </div>
          <div className="card">
            <h2>Drafts and dashboard</h2>
            <p>Customers can save drafts, return by email or website name, and edit published websites.</p>
          </div>
          <div className="card">
            <h2>Built to convert</h2>
            <p>Your site can show clear action buttons so visitors know exactly how to order, book, buy, or contact the business.</p>
          </div>
        </section>

        <section className="brandSection aiReadySection" aria-labelledby="creators-businesses-title">
          <div>
            <span className="kicker">For Creators &amp; Businesses</span>
            <h2 id="creators-businesses-title">Choose how you want to build.</h2>
            <p>
              Create your own website with the Cookie Mini Website Builder, or request done-for-you
              help from Cookie Digital Creations. Both paths are designed to give customers clear
              information and a simple next step.
            </p>
            <div className="aiReadyActions">
              <Link className="btn" href="/builder">Build My Own Website</Link>
              <Link className="btn dark" href="/done-for-you">Request Website Help</Link>
            </div>
          </div>
          <aside>
            <span className="aiReadyBadge">AI-READY FOUNDATION</span>
            <h3>Clear for people. Organized for modern discovery.</h3>
            <p>
              Helpful headings, plain-language service details, mobile-friendly pages, useful links,
              and accurate machine-readable information make each business easier to understand.
            </p>
            <small>AI-ready does not guarantee placement or recommendations by any search or AI platform.</small>
          </aside>
        </section>

        <section className="brandSection homepageFaq" id="faq" aria-labelledby="faq-title">
          <div className="faqHeading">
            <span className="kicker">Helpful answers before you begin</span>
            <h2 id="faq-title">Questions? We’ve Got Answers.</h2>
            <p>Start with the builder, request personal help, or learn what to prepare before creating your website.</p>
          </div>
          <div className="faqList">
            {faqs.map((item) => (
              <details key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
          <div className="faqContact">
            <strong>Still deciding?</strong>
            <a href="mailto:hello@cookiesdigitalcreations.com">Email hello@cookiesdigitalcreations.com</a>
          </div>
        </section>

        <OwnerFooter />
      </main>
    </>
  );
}
