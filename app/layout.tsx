import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: "GC2Go — Turn the reel into a real plan",
  description: "Get the trip out of the group chat.",
};

export const viewport: Viewport = {
  themeColor: "#080B12",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
