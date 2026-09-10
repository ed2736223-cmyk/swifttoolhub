import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import Script from "next/script";
import AuthProvider from "@/components/AuthProvider";
import JsonLd from "@/components/JsonLd";
import { SITE_URL } from "@/lib/site";
import { getSiteSettings } from "@/lib/siteSettings";
import "./globals.css";

const display = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SwiftToolHub — Free IT Tools For Faster Work",
    template: "%s — SwiftToolHub",
  },
  description:
    "A growing library of free, fast IT and developer tools — converters, checkers, generators and calculators — built for daily work. No sign-up required.",
  openGraph: {
    title: "SwiftToolHub — Free IT Tools For Faster Work",
    description:
      "Converters, checkers, generators and calculators in one clean workspace — no sign-up, no clutter.",
    url: SITE_URL,
    siteName: "SwiftToolHub",
    type: "website",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SwiftToolHub",
  url: SITE_URL,
  logo: `${SITE_URL}/icon.png`,
  email: "info@swifttoolhub.com",
  sameAs: [],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "SwiftToolHub",
  url: SITE_URL,
  description:
    "A free online toolkit of converters, generators, checkers and calculators for everyday IT work.",
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/tools?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Sitewide Adsterra format (Social Bar / Popunder), fully backend-managed
  // from /admin/settings — no env var, no redeploy needed to turn on/off.
  const settings = await getSiteSettings();
  const sitewideAdSrc =
    settings.adsEnabled && settings.adsterraSitewideSrc ? settings.adsterraSitewideSrc : null;

  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <head>
        <JsonLd data={organizationSchema} />
        <JsonLd data={websiteSchema} />
        {sitewideAdSrc && (
          <Script
            src={sitewideAdSrc.startsWith("//") ? sitewideAdSrc : `//${sitewideAdSrc}`}
            strategy="afterInteractive"
          />
        )}
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
