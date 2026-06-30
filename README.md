# Noirtable

Noirtable is a small restaurant website built as a portfolio project.
It pairs an editorial dining-room front end with a working menu, cart,
checkout, reservations, and a staff view for the evening team.

## Concept

A quiet late-night dining room with a short seasonal menu.
The site keeps ordering inside the same calm restaurant language instead of
turning the meal into a delivery-app screen.

## Core Features

- Editorial restaurant homepage
- Responsive mobile layout
- Supabase-backed menu items
- Filterable menu with dish detail views
- Add/remove quantity controls
- Persistent cart with localStorage
- Cart page
- Checkout page with pickup or delivery
- Order success page
- Table reservation form
- Staff login
- Staff desk for orders, reservations, and menu records
- Order status updates: new, accepted, preparing, completed, declined
- Reservation status updates: new, confirmed, declined

## Pages

- `/` - restaurant homepage and reservation form
- `/menu` - full menu
- `/cart` - current order
- `/checkout` - guest details and service method
- `/order/success` - final order confirmation
- `/staff/login` - staff sign in
- `/staff` - staff desk
- `/case-study` - project journal and case study

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Supabase
- Vercel

## Environment

Add these variables locally and in Vercel:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Try The Flow

1. Open `/menu`.
2. Add a plate to the cart.
3. Go through `/cart` and `/checkout`.
4. Open `/staff/login`, then `/staff`, to review the order.

## Running Locally

```bash
npm install
npm run dev
```

Open:

```bash
http://localhost:3000
```

Build check:

```bash
npm run build
```
