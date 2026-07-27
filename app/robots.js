export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/customer/']
    },
    sitemap: 'https://www.cookiesdigitalcreations.com/sitemap.xml',
    host: 'https://www.cookiesdigitalcreations.com'
  };
}
