Cookie Mini Website Builder Pro — Admin Plan Management Upgrade

Upload the inside folders/files to the clean GitHub repo and commit changes.

Before testing admin notes, run this SQL in Supabase SQL Editor:

supabase/admin_plan_management_migration.sql

This upgrade adds:
- Stronger /admin plan management dashboard
- Plan controls: Free / Starter / Business / Premium
- Status controls: published / paused / draft
- Extra page count
- Monthly price field
- Admin-only backup link
- Private admin notes
- MRR estimate

No new Vercel environment variables are required.

