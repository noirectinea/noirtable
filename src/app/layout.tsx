import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Noirtable | Restaurant Ordering System",
  description:
    "A restaurant website with menu ordering, reservations, checkout, and staff desk.",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
