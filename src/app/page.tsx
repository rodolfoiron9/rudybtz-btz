import AlbumShowcase from '@/components/album-showcase';
import BioSection from '@/components/bio-section';
import Footer from '@/components/footer';
import Header from '@/components/header';
import HeroSection from '@/components/hero-section';
import RoadmapSection from '@/components/roadmap-section';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <div id="albums" className="py-20 md:py-32">
          <AlbumShowcase />
        </div>
        <div id="bio" className="py-20 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-background to-transparent"></div>
          <BioSection />
        </div>
        <div id="roadmap" className="py-20 md:py-32">
          <RoadmapSection />
        </div>
      </main>
      <Footer />
    </div>
  );
}

const bgGrid = `
  "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(127 0 255 / 0.1)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e"
`;