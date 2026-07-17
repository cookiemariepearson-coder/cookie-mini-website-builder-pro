# Paid Checkout + Admin Plan Fix

Upload the inside files/folders to the root of your GitHub repo, then commit changes and wait for Vercel to redeploy.

This update fixes paid checkout buttons that were giving a 404 by routing paid plans through:
- /checkout/starter
- /checkout/business
- /checkout/premium
- /checkout/extra

Those routes normalize Gumroad links and add https:// automatically if needed.

Still make sure your Vercel Environment Variable values are full Gumroad links, ideally like:
https://cookiepearson.gumroad.com/l/your-product?wanted=true

This update also organizes the admin page into tabs:
- Websites
- Plans & Status
- Admin Notes

Do not change IONOS, domain settings, Supabase keys, or Gumroad return links for this fix.
