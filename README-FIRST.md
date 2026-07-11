# Cookie Mini Website Builder Pro — Admin Upgrade Build Fix

This package fixes the Vercel deployment error from the admin upgrade by reducing Next.js build workers in `next.config.js`.

## Upload steps

1. Unzip this package.
2. Open GitHub repo: `cookie-mini-website-builder-pro`.
3. Click **Code → Add file → Upload files**.
4. Upload the inside files/folders, not this ZIP.
5. Click **Commit changes**.
6. Wait for Vercel to redeploy and show **Ready**.

## Required Vercel variable

Add this in Vercel → Settings → Environment Variables:

ADMIN_PIN=your-private-admin-pin

Choose Production and Preview, save, then redeploy.

## Admin URL

https://www.cookiesdigitalcreations.com/admin
