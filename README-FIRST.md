Cookie Mini Website Builder Pro — Customer Content Editing Fix

Upload the inside files/folders to GitHub and commit changes.

IMPORTANT FIRST STEP:
Before testing the customer editor, run this SQL once in Supabase SQL Editor:

supabase/customer_content_fields_migration.sql

This adds the database fields needed for customers to save:
- service/offer boxes
- page wording for About, Services, Products, Gallery, Testimonials, Contact, FAQ
- editable Services section title

What changed:
- Free Launch Page wording no longer appears on the customer live website.
- Accent color now affects the live website templates better.
- Template labels no longer show “3D local service layout” wording.
- Customers can edit service/offer boxes.
- Customers can edit page wording for selected pages.
- “What We Offer” is no longer hardcoded; customers can change the section title.
- Contact button still opens the customer email.

Do not upload node_modules or .next.
