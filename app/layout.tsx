import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.deliriumdownloads.com"),
  title: "Delirium Downloads | Practical resources for health and care staff",
  description:
    "Free, printable delirium resources for health and care staff, including clinical prompts and handouts for patients and families.",
  alternates: { canonical: "/" },
  authors: [{ name: "Professor Alasdair MacLullich", url: "https://www.alasdairmaclullich.com/" }],
  openGraph: {
    title: "Delirium resources, ready for the next conversation",
    description: "25 free clinical prompts and patient/family handouts for health and care staff, with editable Word alternatives.",
    url: "https://www.deliriumdownloads.com/",
    siteName: "Delirium Downloads",
    type: "website",
    locale: "en_GB",
    images: [{ url: "/og-delirium-downloads.png", width: 1731, height: 909, alt: "Delirium Downloads - free practical PDF guides" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Delirium Downloads",
    description: "Free delirium resources for health and care staff, ready to print.",
    images: ["/og-delirium-downloads.png"],
    creator: "@A_MacLullich",
  },
  robots: { index: false, follow: false, noarchive: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB">
      <body>{children}</body>
    </html>
  );
}
