# Cookie Mini Website Builder Pro — Admin Upgrade

This package adds the next upgrades after payment, Supabase, and customer subdomains are working.

## New in this update

- Owner Admin Control Center at `/admin`
- Admin PIN protection using the `ADMIN_PIN` Vercel environment variable
- Customer website list from Supabase
- Estimated monthly recurring revenue display
- Open direct link and customer subdomain buttons
- Edit customer websites at `/admin/edit/customer-slug`
- Pause/unpublish customer websites without deleting them
- Updated dashboard with links to Builder, Admin, and Debug tools

## Upload steps

1. Unzip this package.
2. Open your GitHub repo: `cookie-mini-website-builder-pro`.
3. Click `Code` → `Add file` → `Upload files`.
4. Upload the inside files and folders from this package.
5. Click `Commit changes`.
6. Wait for Vercel to redeploy and show `Ready`.

## Required Vercel environment variable

Go to Vercel → Project → Settings → Environment Variables.

Add:

`ADMIN_PIN`

Value:

Choose a private PIN, for example a longer code only you know.

Environment:

Production and Preview

After adding `ADMIN_PIN`, redeploy the latest Ready deployment.

## How to use the admin dashboard

Visit:

`https://www.cookiesdigitalcreations.com/admin`

Enter your admin PIN.

You can then:

- See customer websites saved in Supabase
- Open direct links
- Open customer subdomains
- Edit site content
- Pause a website

## Important

Do not share your admin PIN publicly. This is a simple owner control upgrade, not a full customer account/login system yet.

Next bigger upgrade after this should be customer accounts/login and subscription status checks.
