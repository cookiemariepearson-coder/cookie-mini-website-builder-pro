# Cookie Mini Website Builder Pro — Live Site Renderer Fix

This fixes why the section edits looked like they were not working.

The customer editor was saving the editable fields, but the public live website route `/site/[slug]` was still using an old hardcoded layout. That old layout ignored:

- service/offer box edits
- Services & Offers title edits
- About, Services, Products, Gallery, Testimonials, Contact, and FAQ wording edits
- 3D artwork card wording
- the stronger accent color styling

## What this package changes

- Replaces `app/site/[slug]/page.tsx` so the live website renders through `CustomerSiteView`.
- Keeps the section editor fields on `/customer/edit/[slug]`.
- Keeps Supabase save/update routes for section content.
- Keeps the 3D template/artwork and accent color changes.
- Removes the old hardcoded "What We Offer" live-site output.

## Upload steps

1. Unzip this package.
2. Go to GitHub → `cookie-mini-website-builder-pro`.
3. Click `Code → Add file → Upload files`.
4. Upload the inside files/folders.
5. Click `Commit changes`.
6. Wait for Vercel to redeploy and show `Ready`.

## Supabase step

Run this SQL again if you are unsure it was run already. It is safe to run again:

`supabase/customer_content_fields_migration.sql`

## Test steps

1. Open `https://www.cookiesdigitalcreations.com/customer`.
2. Load the test website.
3. Click `Edit Website Details`.
4. Change one offer box title and description.
5. Change the About wording.
6. Change the accent color.
7. Click `Save & Republish`.
8. Open the direct link and subdomain link.
9. Hard refresh the live site if needed.
