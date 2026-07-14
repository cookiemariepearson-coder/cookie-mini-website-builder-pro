# Cookie Mini Website Builder Pro — Gallery Media + Builder Readability Fix

This update adds media access for gallery-style pages and improves builder screen readability.

## What changed

- Gallery-style pages now allow customers to add images, videos, and media links.
- Media controls show on pages like Gallery, Portfolio, Projects, Before & After, Products, and Menu.
- Customers can upload small image/video files or paste a media link.
- Uploaded media shows in the live preview and on the published customer website after Save & Republish.
- Builder page uses a darker sidebar/background so text is easier to see.
- Existing domain, Gumroad, Supabase, AI Video Studio, legal pages, and template setup are left alone.

## Important note about video uploads

This version stores small uploaded files inside the existing page content data, so keep uploads small. Larger videos should be added as links for now. A later upgrade can add Supabase Storage for larger video/image hosting.

## How to upload

1. Unzip this package.
2. Go to GitHub → `cookie-mini-website-builder-pro`.
3. Click **Code → Add file → Upload files**.
4. Upload the inside files/folders, not the ZIP itself.
5. Click **Commit changes**.
6. Wait for Vercel to deploy and show **Ready**.

## Test

- Open `https://www.cookiesdigitalcreations.com/builder`.
- Choose a template with Gallery or add the Gallery page.
- Add image/video/media link under Pages & Wording.
- Preview it.
- Publish or save and republish.

No Supabase migration is required for this update.
