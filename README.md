# Noirtable

Noirtable is a premium restaurant ordering website built as a portfolio project.
The project combines an editorial restaurant landing page with a working menu,
cart, checkout flow, table requests, and a small staff desk for orders.

## Concept

A quiet late-night dining room with a short seasonal menu.
The design direction is dark, warm, restrained, and editorial rather than a
generic delivery marketplace.

## Core Features

- Editorial restaurant homepage
- Responsive mobile layout
- Filterable menu with dish detail view
- Menu badges for featured, seasonal, popular, and limited dishes
- Add/remove quantity controls
- Persistent cart with localStorage
- Cart page
- Checkout page
- Order success page
- File-backed order storage
- Table reservation form
- Staff desk for orders and reservations
- Staff order filters by status
- Demo orders and reservations for portfolio presentation
- Order status updates: new, accepted, preparing, completed
- Reservation status updates: new, confirmed, declined

## Pages

- `/` - restaurant homepage, menu, reservation form
- `/cart` - current order
- `/checkout` - guest details and order confirmation
- `/order/success` - final order confirmation
- `/admin/orders` - staff desk
- `/case-study` - portfolio presentation page

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Local JSON storage for portfolio backend behavior

## Why This Project Exists

The goal of this project is to show more than a visual landing page.
It demonstrates a complete small business website flow:

- guests can browse dishes
- guests can place an order
- guests can request a table
- staff can review and update requests

This makes the project useful as a restaurant website case study, not only a
design concept.

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
npm run lint
npm run build
```
