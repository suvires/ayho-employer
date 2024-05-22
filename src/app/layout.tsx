import type { Metadata } from "next";
import { Montserrat, Advent_Pro } from "next/font/google";
import "@/stylesheets/main.scss";

const primaryFont = Advent_Pro({
  subsets: ["latin"],
  variable: "--font-primary",
});

const secondaryFont = Montserrat({
  subsets: ["latin"],
  variable: "--font-secondary",
});

export const metadata: Metadata = {
  title: "ayho",
  description: "Encuentra perfiles",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${primaryFont.variable} ${secondaryFont.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
