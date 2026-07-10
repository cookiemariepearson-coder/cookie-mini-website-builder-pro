import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const host = req.headers.get('host') || '';
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'cookiesdigitalcreations.com';

  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/builder') ||
    url.pathname.startsWith('/dashboard') ||
    url.pathname.startsWith('/site') ||
    PUBLIC_FILE.test(url.pathname)
  ) {
    return NextResponse.next();
  }

  const hostname = host.split(':')[0];
  const isLocalhost = hostname.includes('localhost') || hostname.includes('127.0.0.1');

  // Local testing: mary.localhost:3000 will render /site/mary if your browser supports it.
  if (isLocalhost && hostname.endsWith('.localhost')) {
    const subdomain = hostname.replace('.localhost', '');
    url.pathname = `/site/${subdomain}`;
    return NextResponse.rewrite(url);
  }

  // Production wildcard subdomains: customername.cookiesdigitalcreations.com
  if (hostname.endsWith(`.${rootDomain}`)) {
    const subdomain = hostname.replace(`.${rootDomain}`, '');
    const reserved = ['www', 'app', 'admin', 'builder', 'dashboard'];
    if (subdomain && !reserved.includes(subdomain)) {
      url.pathname = `/site/${subdomain}`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
