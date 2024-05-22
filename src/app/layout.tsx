import type { Metadata } from "next";
import { Montserrat, Raleway } from "next/font/google";
import "@/stylesheets/main.scss";

const primaryFont = Raleway({
  adjustFontFallback: false,
  subsets: ["latin"],
  variable: "--font-primary",
});

const secondaryFont = Montserrat({
  adjustFontFallback: false,
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
