import './globals.css';
import './owner-footer.css';
import './readability-fix.css';
import './plan-showcase.css';
import './mobile-responsive-fix.css';
import './pricing-cleanup-fix.css';
import './plan-accuracy-fix.css';
import './clean-pricing-ai-video-fix.css';
import './customer-action-brand-refresh.css';
import './customer-site-templates-rebuild.css';
import './cookie-ai-assistant.css';
import './done-for-you.css';
import './ai-commerce-home.css';
import CookieAiAssistant from '../components/CookieAiAssistant';

export const metadata = {
  metadataBase: new URL('https://www.cookiesdigitalcreations.com'),
  title: {
    default: 'Cookie Digital Creations | Build, Book, Sell & Grow',
    template: '%s | Cookie Digital Creations'
  },
  description: 'Build your own business website or request done-for-you website services from Cookie Digital Creations.',
  alternates: {
    canonical: '/'
  },
  openGraph: {
    title: 'Cookie Digital Creations',
    description: 'Website-building tools and done-for-you website services for creators and small businesses.',
    url: 'https://www.cookiesdigitalcreations.com/',
    siteName: 'Cookie Digital Creations',
    type: 'website'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <CookieAiAssistant />
      </body>
    </html>
  );
}
