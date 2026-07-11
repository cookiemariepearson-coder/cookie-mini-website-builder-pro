# Cookie Mini Website Builder Pro — Customer Edit + Extra Page Checkout Fix

This update fixes the customer dashboard edit flow.

## What changed

- Customer edits now save and republish to Supabase.
- Published customer websites are forced dynamic/no-cache so saved edits show after refresh.
- Changing templates now updates the live preview and saved published site.
- Customer edit page now includes a live preview.
- Extra pages are handled automatically from the customer editor.
- If Starter or Business customers add pages beyond their plan limit, the $10/month extra page add-on checkout opens directly.
- Premium customers can still select all pages without extra page checkout.

## Required Vercel Environment Variable

Make sure this exists in Vercel:

NEXT_PUBLIC_EXTRA_PAGE_SUBSCRIPTION_CHECKOUT_URL

Value: your Gumroad $10/month extra page add-on checkout link. It should start with https://

## Gumroad return link

Keep the same Gumroad return/content link for all subscriptions and the extra page add-on:

https://www.cookiesdigitalcreations.com/checkout/success?paid=1

## Upload steps

1. Unzip this package.
2. Upload the inside files/folders to GitHub.
3. Commit changes.
4. Let Vercel redeploy.
5. Test https://www.cookiesdigitalcreations.com/customer

Do not change IONOS, Supabase, or Vercel domain settings for this update.
