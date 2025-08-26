'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2 } from 'lucide-react';

interface HeroSlide {
  id: string;
  type: 'image' | 'video';
  url: string;
  title?: string;
  description?: string;
}

const defaultSlides: HeroSlide[] = [
  {
    id: '1',
    type: 'video',
    url: 'https://videos.pexels.com/video-files/3129671/3129671-uhd_3840_2160_30fps.mp4',
    title: 'Electronic Dreams',
    description: 'Immersive audio experiences'
  },
  {
    id: '2',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070',
    title: 'Sound Waves',
    description: 'Where technology meets artistry'
  },
  {
    id: '3',
    type: 'video',
    url: 'https://videos.pexels.com/video-files/2022395/2022395-uhd_3840_2160_30fps.mp4',
    title: 'Future Bass',
    description: 'Next generation music production'
  }
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [slides] = useState<HeroSlide[]>(defaultSlides);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [slides.length, isPlaying]);

  const currentSlideData = slides[currentSlide];

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden">
      {/* Background Media */}
      <div className="absolute inset-0">
        {currentSlideData?.type === 'video' ? (
          <video
            key={currentSlideData.id}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src={currentSlideData.url} type="video/mp4" />
          </video>
        ) : (
          <div
            key={currentSlideData?.id}
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${currentSlideData?.url})` }}
          />
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center text-center">
        <div className="max-w-4xl px-4">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-widest uppercase font-headline text-white mb-6">
            RUDYBTZ
          </h1>
          
          {currentSlideData && (
            <>
              <h2 className="text-2xl md:text-4xl font-bold text-accent mb-4">
                {currentSlideData.title}
              </h2>
              <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                {currentSlideData.description}
              </p>
            </>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="glassmorphism bg-primary/20 hover:bg-primary/30 border border-primary/30">
              <Play className="w-5 h-5 mr-2" />
              Listen Now
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="glassmorphism bg-white/10 hover:bg-white/20 border border-white/30 text-white"
            >
              <Volume2 className="w-5 h-5 mr-2" />
              View Albums
            </Button>
          </div>
        </div>
      </div>

      {/* Slide Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center space-x-4">
          {/* Play/Pause Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={togglePlayback}
            className="glassmorphism bg-white/10 hover:bg-white/20 border border-white/30 text-white"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>

          {/* Slide Indicators */}
          <div className="flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide
                    ? 'bg-accent scale-125'
                    : 'bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 right-8 z-20">
        <div className="flex flex-col items-center text-white/60">
          <span className="text-sm mb-2 rotate-90 origin-center">Scroll</span>
          <div className="w-px h-16 bg-gradient-to-b from-white/60 to-transparent" />
        </div>
      </div>
    </section>
  );
}