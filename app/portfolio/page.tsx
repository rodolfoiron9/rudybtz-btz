import Header from '@/components/header';
import HeroSection from '@/components/hero-section';
import AlbumShowcase from '@/components/album-showcase';
import BioSection from '@/components/bio-section';
import FloatingVisualizer from '@/components/floating-visualizer';
import Footer from '@/components/footer';
import StructuredData from '@/components/structured-data';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function PortfolioPage() {
  return (
    <>
      <StructuredData />
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        
        <main>
          {/* Hero Section */}
          <Suspense fallback={<div className="h-screen bg-background animate-pulse" />}>
            <HeroSection />
          </Suspense>

          {/* Albums Section */}
          <section id="albums" className="py-20 md:py-32">
            <Suspense fallback={
              <div className="container mx-auto space-y-12">
                <div className="text-center space-y-4">
                  <Skeleton className="h-16 w-96 mx-auto" />
                  <Skeleton className="h-6 w-[600px] mx-auto" />
                </div>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="grid md:grid-cols-2 gap-8">
                    <Skeleton className="aspect-square w-full" />
                    <div className="space-y-4 p-8">
                      <Skeleton className="h-10 w-3/4" />
                      <Skeleton className="h-6 w-1/2" />
                      <div className="space-y-2">
                        {[...Array(5)].map((_, j) => (
                          <Skeleton key={j} className="h-8 w-full" />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            }>
              <AlbumShowcase />
            </Suspense>
          </section>

          {/* Bio Section */}
          <section id="bio" className="py-20 md:py-32 relative overflow-hidden">
            <Suspense fallback={
              <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                  <Skeleton className="h-16 w-80 mx-auto" />
                  <Skeleton className="h-32 w-32 rounded-full mx-auto" />
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <Skeleton key={i} className="h-6 w-full" />
                    ))}
                  </div>
                  <div className="flex justify-center space-x-4">
                    {[...Array(4)].map((_, i) => (
                      <Skeleton key={i} className="h-12 w-12 rounded-lg" />
                    ))}
                  </div>
                </div>
              </div>
            }>
              <BioSection />
            </Suspense>
          </section>

          {/* Contact Section */}
          <section id="contact" className="py-20 md:py-32 bg-card/30">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-4xl md:text-6xl font-black uppercase font-headline text-metallic mb-8">
                Get In Touch
              </h2>
              <p className="text-lg text-foreground/70 mb-12 max-w-2xl mx-auto">
                Ready to collaborate or want to book a show? Let's connect and create something amazing together.
              </p>
              <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="glassmorphism bg-card/50 p-6 rounded-xl">
                  <h3 className="text-xl font-bold font-headline text-metallic mb-4">Bookings</h3>
                  <p className="text-foreground/70 mb-4">For live performances and events</p>
                  <a 
                    href="mailto:bookings@rudybtz.com" 
                    className="text-accent hover:text-accent/80 transition-colors font-semibold"
                  >
                    bookings@rudybtz.com
                  </a>
                </div>
                <div className="glassmorphism bg-card/50 p-6 rounded-xl">
                  <h3 className="text-xl font-bold font-headline text-metallic mb-4">Collaborations</h3>
                  <p className="text-foreground/70 mb-4">For music production and features</p>
                  <a 
                    href="mailto:collab@rudybtz.com" 
                    className="text-accent hover:text-accent/80 transition-colors font-semibold"
                  >
                    collab@rudybtz.com
                  </a>
                </div>
                <div className="glassmorphism bg-card/50 p-6 rounded-xl">
                  <h3 className="text-xl font-bold font-headline text-metallic mb-4">General</h3>
                  <p className="text-foreground/70 mb-4">For everything else</p>
                  <a 
                    href="mailto:hello@rudybtz.com" 
                    className="text-accent hover:text-accent/80 transition-colors font-semibold"
                  >
                    hello@rudybtz.com
                  </a>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
        
        {/* Floating Audio Visualizer */}
        <Suspense fallback={null}>
          <FloatingVisualizer />
        </Suspense>
      </div>
    </>
  );
}