import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
// import { ClerkProvider } from '@clerk/nextjs';
import ConvexClerkProvider from '@/providers/ConvexClerkProvider';
import Navbar from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'ai-fitness - Get Jacked',
  description: 'A modern fitness AI platform to get jacked for free.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexClerkProvider>
      <html lang='en'>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Navbar />
          {children}
          <Footer />
        </body>
      </html>
    </ConvexClerkProvider>
  );
}
