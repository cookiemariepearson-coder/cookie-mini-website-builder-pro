import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Mini Website Builder',
  description: 'Build and publish customer websites on your own subdomain platform.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
