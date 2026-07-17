import Link from 'next/link';
import { redirect } from 'next/navigation';

const checkoutMap = {
  starter: process.env.NEXT_PUBLIC_STARTER_SUBSCRIPTION_CHECKOUT_URL,
  business: process.env.NEXT_PUBLIC_BUSINESS_SUBSCRIPTION_CHECKOUT_URL,
  premium: process.env.NEXT_PUBLIC_PREMIUM_SUBSCRIPTION_CHECKOUT_URL,
  extra: process.env.NEXT_PUBLIC_EXTRA_PAGE_SUBSCRIPTION_CHECKOUT_URL
};

const planLabels = {
  starter: 'Starter Pro — $19/month',
  business: 'Business — $30/month',
  premium: 'Premium — $50/month',
  extra: 'Extra Page Add-On — $10/month per page'
};

function cleanCheckoutUrl(raw) {
  if (!raw) return '';
  let url = String(raw).trim();
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('//')) return `https:${url}`;
  if (/^[a-z0-9.-]+\.[a-z]{2,}\/.*$/i.test(url) || /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(url)) {
    return `https://${url}`;
  }
  return url;
}

export default function CheckoutRedirect({ params }) {
  const plan = params.plan;
  const rawUrl = checkoutMap[plan];
  const url = cleanCheckoutUrl(rawUrl);

  if (url && (url.startsWith('https://') || url.startsWith('http://'))) {
    redirect(url);
  }

  return (
    <main className="wrap dashboard">
      <span className="kicker">Checkout setup needed</span>
      <h1>{planLabels[plan] || 'Checkout'} link is missing or invalid.</h1>
      <p>
        The paid checkout button is working, but Vercel does not have a valid Gumroad checkout URL for this plan yet.
      </p>
      <div className="notice error">
        Make sure the Vercel Environment Variable value starts with <strong>https://</strong> and points to the correct Gumroad product.
      </div>
      <h2>Use these Vercel variable names</h2>
      <ul>
        <li><strong>NEXT_PUBLIC_STARTER_SUBSCRIPTION_CHECKOUT_URL</strong></li>
        <li><strong>NEXT_PUBLIC_BUSINESS_SUBSCRIPTION_CHECKOUT_URL</strong></li>
        <li><strong>NEXT_PUBLIC_PREMIUM_SUBSCRIPTION_CHECKOUT_URL</strong></li>
        <li><strong>NEXT_PUBLIC_EXTRA_PAGE_SUBSCRIPTION_CHECKOUT_URL</strong></li>
      </ul>
      <p><Link className="btn" href="/pricing">Back to Pricing</Link> <Link className="btn dark" href="/builder">Back to Builder</Link></p>
    </main>
  );
}
