import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Reclaim Protocol - Web SDK Demo",
  description: "Demo app to test websdk",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
