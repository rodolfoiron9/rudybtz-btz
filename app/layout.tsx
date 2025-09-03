import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/components/auth';
import { PerformanceMonitor } from '@/components/performance';

export const metadata: Metadata = {
  title: 'RUDYBTZ Portfolio - AI-Powered Music Experience',
  description: 'Immersive digital music portfolio featuring 3D audio visualization and AI-powered content creation.',
  keywords: ['music', 'portfolio', 'AI', '3D visualization', 'electronic music', 'rudy btz'],
  authors: [{ name: 'Rudy BTZ' }],
  creator: 'Rudy BTZ',
  openGraph: {
    title: 'RUDYBTZ Portfolio',
    description: 'Experience the future of music portfolios with AI and 3D visualization',
    type: 'website',
    url: 'https://rudybtz-portfolio.web.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RUDYBTZ Portfolio',
    description: 'AI-Powered Music Experience',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
              --font-inter: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
              --font-orbitron: "Courier New", Courier, monospace, ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono";
            }
          `
        }} />
      </head>
      <body className="antialiased">
        <AuthProvider>
          <PerformanceMonitor
            enableDeviceInfo={process.env.NODE_ENV === 'development'}
            enableNetworkInfo={process.env.NODE_ENV === 'development'}
          />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}