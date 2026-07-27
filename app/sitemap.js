const routes = [
  '',
  '/builder',
  '/pricing',
  '/done-for-you',
  '/video-studio'
];

export default function sitemap() {
  const lastModified = new Date();

  return routes.map((route) => ({
    url: `https://www.cookiesdigitalcreations.com${route}`,
    lastModified,
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.8
  }));
}
