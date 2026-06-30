import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Noirtable | Small Room, Late Plates",
  description:
    "A small restaurant website with a dinner menu, reservations, checkout, and a staff desk.",
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
