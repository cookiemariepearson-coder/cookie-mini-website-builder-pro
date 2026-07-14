Cookie Mini Website Builder Pro — Website Setup Flow Fix

This update fixes the customer setup flow so customers can clearly:

1. Choose what type of website they need.
2. Choose the visual look/design for that website type.
3. Enter their business information.
4. Edit the offer/service boxes before publishing.
5. Edit selected page wording before checkout/publish.
6. See the preview while making changes.
7. Save/publish the customer-specific content into Supabase.

Important notes:
- No new Supabase migration is required if customer_content_fields_migration.sql has already been run.
- The backup/direct link is removed from the customer edit controls. The customer sees the live subdomain link instead.
- Admin can still use troubleshooting links separately if your admin page has them.

Upload the inside files/folders to GitHub, commit changes, and let Vercel redeploy.
