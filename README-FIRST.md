# Cookie Mini Website Builder Pro — Customer Content Deep Fix

This update focuses only on the customer editor/live website issues:

- Adds real editing fields for the 3 offer/service boxes.
- Adds real editing fields for About, Services, Products, Gallery, Testimonials, Contact, and FAQ.
- Saves those fields to Supabase and republishes them.
- Removes generic template labels from the customer-facing template selector.
- Keeps the live website clean so plan wording such as Free Launch Page does not appear on the customer website.
- Improves accent color visibility on the live website.
- Keeps Contact Now as an email button.

## Important Supabase step

Run this SQL once in Supabase SQL Editor if you have not already:

`supabase/customer_content_fields_migration.sql`

Then upload this package's inside files/folders to GitHub and let Vercel redeploy.
