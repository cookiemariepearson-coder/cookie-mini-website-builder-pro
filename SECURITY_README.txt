SECURE WALLET DESIGN

1. Authentication
The browser uses the public Supabase anon key only. Passwords are handled by Supabase Auth.

2. API authorization
Every private API requires the user's Supabase access token. The server verifies that token before reading or changing account data.

3. Wallet control
The browser cannot directly update arcade_wallets. Wallet changes are performed through a service-role Vercel Function and an atomic PostgreSQL function.

4. Idempotency
Every wallet request has a unique reference. Repeating the same request returns the original result instead of charging or crediting twice.

5. Stripe
The checkout session is created for the authenticated user. The Stripe webhook credits the wallet after checkout.session.completed.

6. Row Level Security
Players can read only their own profile, wallet, progress, and transaction history. Direct client wallet updates are not permitted.

7. Remaining anti-cheat limitation
The wallet itself is protected, but a determined user could imitate a game reward request unless complete game validation is moved to server-authoritative game logic. The included endpoint caps reward sizes by game. A future phase should validate completed matches server-side.
