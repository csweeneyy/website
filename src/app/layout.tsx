import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "500", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Connor Sweeney — AI Systems Engineer",
  description:
    "I build AI systems that automate entire business workflows. From NLP pipelines to real-time data platforms.",
  openGraph: {
    title: "Connor Sweeney — AI Systems Engineer",
    description:
      "I build AI systems that automate entire business workflows. From NLP pipelines to real-time data platforms.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={outfit.variable}>
      <body>{children}</body>
    </html>
  );
}
