import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import useLocalStorage from '@/hooks/use-local-storage';
import { initialThemeSettings } from '@/lib/data';
import type { ThemeSettings } from '@/lib/types';
import ThemeProvider from '@/components/theme-provider';

export const metadata: Metadata = {
  title: 'RUDYBTZ Portfolio',
  description: 'The official portfolio for the artist RUDYBTZ',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className='dark'>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider>
            {children}
            <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
    