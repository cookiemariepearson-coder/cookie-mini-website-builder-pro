# Cookie Mini Website Builder Pro — Customer Editor Major Fix

Upload the inside files/folders in this package to the GitHub repo:

cookie-mini-website-builder-pro

Then commit changes and wait for Vercel to redeploy.

This update fixes:
- Customer content editing now stays in the form and saves more reliably.
- The editor uses a side-by-side layout so the live preview stays visible while editing.
- The description box is larger for longer wording.
- Template selection now changes colors, artwork, and visual layout.
- The top hero no longer shows the phone number button; it only shows Contact Now.
- Contact Now opens the customer email when an email is entered.
- Page links at the top of the published website are clickable anchor links.
- Business and Starter plan extra-page limits now trigger the $10/month extra-page checkout when a customer tries to add more than their included pages.
- The extra page wording no longer tells customers to contact Cookie Digital Creations first.

Required Vercel environment variable for extra page checkout:
NEXT_PUBLIC_EXTRA_PAGE_SUBSCRIPTION_CHECKOUT_URL

Keep the Gumroad return link for every product/add-on as:
https://www.cookiesdigitalcreations.com/checkout/success?paid=1
