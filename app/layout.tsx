import type { Metadata } from 'next';
import { Inter, Orbitron } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/auth';
import { PerformanceMonitor } from '@/components/performance';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
});

const orbitron = Orbitron({ 
  subsets: ['latin'],
  variable: '--font-orbitron'
});

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
    <html lang="en" className={`${inter.variable} ${orbitron.variable}`}>
      <body
        className={`${inter.className} antialiased`}
      >
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