# Purpose-Based Template Library Upgrade

This update changes the builder from generic template color swaps into a purpose-based website setup.

## What changed

- Customers choose the website type first.
- Each type has richer visual styles, including food art, flowers, buildings, realistic-style art, cartoon-style art, 3D-style art, luxury styling, and more.
- Each type loads different suggested sections/pages.
- Each type loads different default offer boxes and wording prompts.
- Customer dashboard no longer shows the backup/direct link; the backup link should stay mostly for admin/troubleshooting.
- Accent color remains active.
- Free/Starter/Business/Premium page limits stay the same.

## Upload steps

1. Unzip this package.
2. Upload the inside files/folders to GitHub.
3. Commit changes.
4. Wait for Vercel to redeploy and show Ready.
5. Test: https://www.cookiesdigitalcreations.com/builder

## Supabase

No new Supabase migration is required for this update. It uses the existing template, pages, service_cards, page_content, colors, and published website fields.
