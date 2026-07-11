# Cookie Mini Website Builder Pro — Customer Dashboard Upgrade

This update adds the next upgrade: a customer dashboard and customer edit flow.

## New pages

- `/customer` — customer dashboard/login by email + website slug
- `/my-website` — redirects to `/customer`
- `/customer/edit/[slug]` — customer website editor

## New API route

- `/api/customer/sites/[slug]`
  - `GET` loads a customer site when the email matches the website record
  - `PUT` lets the customer edit basic website details

## What customers can do

- Enter their email and website subdomain/slug
- Open their live website
- Open the backup direct website link
- View plan, status, monthly price, and page count
- Edit business name, headline, description, phone, email, colors, template, and pages
- Save and republish changes

## Upload instructions

1. Unzip this package.
2. In GitHub, open `cookie-mini-website-builder-pro`.
3. Upload the inside files/folders, not the ZIP itself.
4. Commit changes.
5. Wait for Vercel to deploy and show Ready.
6. Test: `https://www.cookiesdigitalcreations.com/customer`

## Notes

This is a simple customer access dashboard using the customer's email + website slug. A future upgrade can add full customer accounts/password login.
