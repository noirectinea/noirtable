# Noirtable Supabase setup

## Environment variables

Add these to `.env.local` for local development and to Vercel Project Settings for production:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_publishable_key
```

Use the Supabase **Project URL** from Settings -> Data API.
Use the **Publishable key** from Settings -> API Keys.
Do not use the secret key in the frontend.

## Menu items

Open Supabase SQL Editor and run:

```sql
-- supabase/menu_items.sql
```

The SQL file creates `public.menu_items`, enables RLS, adds a public read policy for active menu items, and seeds the current Noirtable menu.

## Orders

Open Supabase SQL Editor and run:

```sql
-- supabase/orders.sql
```

The SQL file creates `public.orders` and `public.order_items` for the checkout and staff desk demo flow.
