# Cookie Mini Website Builder Pro — Customer Edit + Template + Page Fix

Upload the inside files/folders of this package to GitHub, commit changes, and let Vercel redeploy.

This update fixes:
- Customer edit form saves and republishes content wording.
- Template changes are visibly different on preview and public sites.
- Published website top navigation links are clickable anchor links.
- Page add/remove is normalized so Home stays required and duplicate/broken page arrays are avoided.
- Extra pages are handled automatically through the $10/month extra page checkout link.
- Removed wording that says customers need to contact Cookie Digital Creations just to unlock extra pages.

Required Vercel environment variables:
- NEXT_PUBLIC_EXTRA_PAGE_SUBSCRIPTION_CHECKOUT_URL
- NEXT_PUBLIC_ROOT_DOMAIN
- Supabase variables already added earlier
- Gumroad checkout variables already added earlier

After deploy, test:
1. /customer
2. Edit Website Details
3. Change headline/description and click Save & Republish
4. Change template and click Save & Republish
5. Add/remove pages and click Save & Republish
6. Open the subdomain and refresh the page
