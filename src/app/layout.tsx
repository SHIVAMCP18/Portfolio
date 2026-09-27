import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shivam Patel — Software Engineer | Cloud, Distributed Systems & AI",
  description:
    "Portfolio of Shivam Patel: Software Engineer specializing in distributed workflow engines, high-concurrency event pipelines, cloud microservices, and applied AI/ML systems. B.E. CSE @ Nirma University.",
  metadataBase: new URL("https://shivam-patel.vercel.app"),
  openGraph: {
    title: "Shivam Patel — Software Engineer",
    description:
      "Software Engineer specializing in distributed workflow orchestration, real-time data streaming, cloud microservices, and applied AI/ML.",
    url: "https://shivam-patel.vercel.app",
    siteName: "Shivam Patel Portfolio",
    images: [
      {
        url: "/images/profile/shivam.png",
        width: 1200,
        height: 630,
        alt: "Shivam Patel — Software Engineer",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shivam Patel — Software Engineer",
    description:
      "Software Engineer specializing in distributed workflow orchestration, real-time data streaming, and cloud microservices.",
    images: ["/images/profile/shivam.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var isDark=window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',isDark);}catch(e){}})();",
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
