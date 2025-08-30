import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { siteConfig } from "@/data/site";
import { getSettingsFromStorage } from "@/lib/settings-storage-edge";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// Generate dynamic metadata from settings
export async function generateMetadata(): Promise<Metadata> {
  let settings;

  try {
    settings = await getSettingsFromStorage();
  } catch (error) {
    console.error('Failed to load settings for metadata:', error);
    // Fallback to static config
    settings = {
      siteName: siteConfig.name,
      siteDescription: siteConfig.description,
      siteUrl: siteConfig.url,
      metaTitle: siteConfig.name,
      metaDescription: siteConfig.description,
      ogImage: siteConfig.ogImage
    };
  }

  return {
    title: {
      default: settings.siteName,
      template: `%s | ${settings.siteName}`,
    },
    description: settings.siteDescription,
    keywords: [
      "AI untuk bisnis",
      "artificial intelligence",
      "UMKM",
      "marketing AI",
      "customer service AI",
      "video AI",
      "copywriting AI"
    ],
    authors: [
      {
        name: `${settings.siteName} Team`,
        url: settings.siteUrl,
      },
    ],
    creator: settings.siteName,
    openGraph: {
      type: "website",
      locale: "id_ID",
      url: settings.siteUrl,
      title: settings.metaTitle,
      description: settings.metaDescription,
      siteName: settings.siteName,
      images: [
        {
          url: settings.ogImage,
          width: 1200,
          height: 630,
          alt: settings.siteName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: settings.metaTitle,
      description: settings.metaDescription,
      images: [settings.ogImage],
      creator: "@markasai",
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon-16x16.png",
      apple: "/apple-touch-icon.png",
    },
    manifest: "/site.webmanifest",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
