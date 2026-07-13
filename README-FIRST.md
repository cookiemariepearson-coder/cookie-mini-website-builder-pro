# Cookie AI Video Studio Demo Add-On — Build Fix

This fixes the Vercel build error from the first AI Video Studio add-on.

The issue was a TypeScript name conflict: the page imported `styles` from the CSS module, then also created a `const styles` array. This package renames the array to `styleOptions`.

## Upload steps

1. Unzip this package.
2. Open GitHub repo: `cookie-mini-website-builder-pro`.
3. Click **Code → Add file → Upload files**.
4. Upload the inside `app` folder and this README.
5. Click **Commit changes**.
6. Wait for Vercel to redeploy and show **Ready**.
7. Test: `https://www.cookiesdigitalcreations.com/video-studio`.
