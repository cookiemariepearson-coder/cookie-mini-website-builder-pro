import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/;
const RESERVED_SUBDOMAINS = ['www', 'app', 'admin', 'builder', 'dashboard', 'api'];

function cleanRootDomain(value?: string | null) {
  const fallback = 'cookiesdigitalcreations.com';
  const raw = (value || fallback).trim();
  return raw
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .split('/')[0]
    .split(':')[0]
    .toLowerCase();
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const forwardedHost = req.headers.get('x-forwarded-host');
  const hostHeader = forwardedHost || req.headers.get('host') || '';
  const hostname = hostHeader.split(',')[0].trim().split(':')[0].toLowerCase();
  const rootDomain = cleanRootDomain(process.env.NEXT_PUBLIC_ROOT_DOMAIN);

  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/builder') ||
    url.pathname.startsWith('/dashboard') ||
    url.pathname.startsWith('/checkout') ||
    url.pathname.startsWith('/site') ||
    PUBLIC_FILE.test(url.pathname)
  ) {
    return NextResponse.next();
  }

  const isLocalhost = hostname.includes('localhost') || hostname.includes('127.0.0.1');

  if (isLocalhost && hostname.endsWith('.localhost')) {
    const subdomain = hostname.replace('.localhost', '');
    if (subdomain && !RESERVED_SUBDOMAINS.includes(subdomain)) {
      url.pathname = `/site/${subdomain}`;
      return NextResponse.rewrite(url);
    }
  }

  // Production wildcard subdomains: customername.cookiesdigitalcreations.com
  if (hostname.endsWith(`.${rootDomain}`)) {
    const subdomain = hostname.replace(`.${rootDomain}`, '');
    if (subdomain && !RESERVED_SUBDOMAINS.includes(subdomain)) {
      url.pathname = `/site/${subdomain}`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
