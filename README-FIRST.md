# Cookie Mini Website Builder Pro — Free Plan + Pricing Cards + Upgrade Flow

Upload the inside files/folders from this ZIP to your GitHub repo and commit changes. Vercel should redeploy automatically.

This update adds:

- Free Launch Page plan
- Pricing page at `/pricing`
- Homepage pricing cards
- Cookie Credits wording for AI tools
- Free publishing without Gumroad checkout
- Free page limited to Home only
- Free pages include a Cookie Mini Website Builder branding badge
- Starter Pro stays $19/month
- Business stays $30/month
- Premium stays $50/month
- Extra pages stay $10/month per page
- Builder plan dropdown now includes Free Launch Page
- Free users are prompted to upgrade when adding pages
- Paid users still go through Gumroad checkout
- AI Video Studio links remain visible

Environment variables still needed in Vercel:

NEXT_PUBLIC_STARTER_SUBSCRIPTION_CHECKOUT_URL
NEXT_PUBLIC_BUSINESS_SUBSCRIPTION_CHECKOUT_URL
NEXT_PUBLIC_PREMIUM_SUBSCRIPTION_CHECKOUT_URL
NEXT_PUBLIC_EXTRA_PAGE_SUBSCRIPTION_CHECKOUT_URL
NEXT_PUBLIC_ROOT_DOMAIN
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
ADMIN_PIN

After deploy, test:

1. https://www.cookiesdigitalcreations.com/pricing
2. https://www.cookiesdigitalcreations.com/builder
3. Choose Free Launch Page and publish one page.
4. Open the free customer subdomain.
5. Try to add a second page on Free and confirm it prompts upgrade.
6. Try paid checkout flow for Starter, Business, and Premium.
