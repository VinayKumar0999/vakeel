import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./global.css";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
//import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vakeel Kutami - Digital Legal Services",
  description: "Connect with verified lawyers for online legal consultations",
  keywords: "legal services, online lawyer, legal consultation, advocate",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* <Providers>
          {children}
          <Toaster />
        </Providers> */}
        <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
      </body>
    </html>
  );
}