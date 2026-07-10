import Link from 'next/link';

export default function CheckoutCancelPage() {
  return <main className="container section">
    <div className="card success-card">
      <span className="badge">Checkout Cancelled</span>
      <h1 style={{fontSize: 'clamp(40px, 7vw, 72px)'}}>No subscription checkout was completed.</h1>
      <p>The website draft was not published. The customer can return to the builder, make changes, and try subscription checkout again.</p>
      <div className="controls">
        <Link className="btn gold" href="/builder">Return to Builder</Link>
        <Link className="btn secondary" href="/">Home</Link>
      </div>
    </div>
  </main>;
}
