# Cookie Mini Website Builder Pro — Section Editor Hard Fix

This package fixes the customer editor so the editable section boxes are actually visible and wired into Supabase.

## What this update fixes

- Adds editable fields for the 3 offer/service boxes.
- Adds editable fields for About, Services, Products, Gallery, Testimonials, Contact, and FAQ.
- Adds editable fields for the 3D artwork card title/details.
- Removes internal template badge wording from the live customer website hero.
- Keeps the Contact Now button opening the customer email.
- Makes accent color affect the public site through CSS variables.
- Stops Business/Starter customers from silently adding extra pages without the add-on checkout.
- Updates dashboard wording to say: Any issues, click the Contact Us button for help.

## Important Supabase step

Run this file again in Supabase SQL Editor. It is safe to run again because it uses `add column if not exists`:

supabase/customer_content_fields_migration.sql

## Upload steps

1. Unzip this package.
2. In GitHub, open the `cookie-mini-website-builder-pro` repo.
3. Click Code → Add file → Upload files.
4. Upload the inside files/folders from this package.
5. Commit changes.
6. Wait for Vercel to deploy and show Ready.
7. Test /customer/edit/customer-slug.

