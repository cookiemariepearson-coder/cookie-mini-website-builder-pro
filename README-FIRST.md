# Cookie Mini Website Builder Pro — Published Website Open Fix

This update fixes the success page so the main **Open Published Website** button uses the reliable direct path:

`https://www.cookiesdigitalcreations.com/site/customer-slug`

It also keeps the customer subdomain button:

`https://customer-slug.cookiesdigitalcreations.com`

Why: if Supabase saved the site but the wildcard subdomain is still not routing, the direct path confirms the website is published while DNS/wildcard routing is checked.

## Upload steps

1. Unzip this package.
2. Go to GitHub → `cookie-mini-website-builder-pro`.
3. Click **Code** → **Add file** → **Upload files**.
4. Upload the inside files/folders, not the ZIP itself.
5. Click **Commit changes**.
6. Wait for Vercel to redeploy and show **Ready**.

## After deploy

1. Go to `https://www.cookiesdigitalcreations.com/debug/site-check`.
2. Type the customer slug, for example `southern-realty-investment-group-llc`.
3. Test **Open Direct Site Link** first.
4. If the direct link opens but the customer subdomain does not, check Vercel → Domains and make sure `*.cookiesdigitalcreations.com` says **Valid Configuration**.

## Vercel variables required

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_ROOT_DOMAIN` = `cookiesdigitalcreations.com`
- `NEXT_PUBLIC_STARTER_SUBSCRIPTION_CHECKOUT_URL`
- `NEXT_PUBLIC_BUSINESS_SUBSCRIPTION_CHECKOUT_URL`
- `NEXT_PUBLIC_PREMIUM_SUBSCRIPTION_CHECKOUT_URL`
- `NEXT_PUBLIC_EXTRA_PAGE_SUBSCRIPTION_CHECKOUT_URL`
