'use client';

import AlbumShowcase from '@/components/album-showcase';
import BioSection from '@/components/bio-section';
import Footer from '@/components/footer';
import Header from '@/components/header';
import HeroSection from '@/components/hero-section';
import type { Album } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import useLocalStorage from '@/hooks/use-local-storage';
import { initialAlbums } from '@/lib/data';

export default function Home() {
  const [albums] = useLocalStorage<Album[]>('rudybtz-albums', initialAlbums);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This ensures that the component only renders on the client
    // where localStorage is available, preventing hydration mismatches.
    setIsClient(true);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <div id="albums" className="py-20 md:py-32">
         {!isClient ? (
            <div className="container mx-auto space-y-12">
                <div className="text-center">
                    <h2 className="mb-4 text-4xl font-black tracking-wider uppercase md:text-6xl font-headline">Discography</h2>
                    <p className="max-w-2xl mx-auto mb-12 text-lg text-foreground/70">
                    Explore the sonic journeys crafted by RUDYBTZ. Each album is a unique universe of sound.
                    </p>
                </div>
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="grid md:grid-cols-2">
                        <Skeleton className="w-full h-full aspect-square"/>
                        <div className="flex flex-col p-6 text-left md:p-8">
                            <Skeleton className="w-3/4 h-10 mb-4"/>
                            <Skeleton className="w-1/2 h-6 mb-6"/>
                            <div className="space-y-2">
                                {[...Array(4)].map((_, j) => <Skeleton key={j} className="w-full h-8"/>)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
         ) : (
            <AlbumShowcase albums={albums} />
         )}
        </div>
        <div id="bio" className="py-20 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-background to-transparent"></div>
          <BioSection />
        </div>
      </main>
      <Footer />
    </div>
  );
}
