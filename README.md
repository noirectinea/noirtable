# Noirtable

Noirtable is a fictional six-table restaurant site.
It has the parts a small room would actually need: a menu, a cart, checkout,
table requests, and a staff screen for the evening.

## The Idea

Most restaurant ordering pages start to feel like a food app. This one tries to
stay in the room: quiet type, plain controls, short copy, and no shouting around
the food.

## What Is Inside

- Homepage for the room
- Menu pulled from Supabase
- Dish view, filters, and quantity controls
- Cart saved in the browser
- Pickup or delivery checkout
- Order received page
- Table request form
- Staff sign in
- Staff desk for orders, reservations, and menu records

## Pages

- `/` - room, menu preview, and reservation form
- `/menu` - full menu
- `/cart` - plates in the order
- `/checkout` - name, phone, time, pickup or delivery
- `/order/success` - the kitchen has it
- `/staff/login` - staff sign in
- `/staff` - tonight's list
- `/case-study` - build notes

## Built With

- Next.js
- React
- TypeScript
- Tailwind CSS
- Supabase
- Vercel

## Env

Add these locally and in Vercel:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Run Through It

1. Open `/menu`.
2. Add a dish.
3. Send it through cart and checkout.
4. Open `/staff/login`, then `/staff`.
5. Move the order through the evening list.

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
