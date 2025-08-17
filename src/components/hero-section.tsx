'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import useLocalStorage from '@/hooks/use-local-storage';
import { initialHeroSlides } from '@/lib/data';
import type { HeroSlide } from '@/lib/types';


export default function HeroSection() {
  const [backgrounds] = useLocalStorage<HeroSlide[]>('rudybtz-hero-slides', initialHeroSlides);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  useEffect(() => {
    if (backgrounds.length === 0) return;

    const interval = setInterval(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
    }, 7000); // Increased interval for videos

    return () => clearInterval(interval);
  }, [backgrounds]);
  
  if (backgrounds.length === 0) {
    return (
        <section className="relative flex items-center justify-center w-full h-screen overflow-hidden bg-background">
             <div className="relative z-10 text-center">
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-widest uppercase font-headline text-metallic">
                RUDYBTZ
                </h1>
                <p className="mt-4 text-lg md:text-xl font-light tracking-wider text-neutral-300 font-body">
                Sonic Architect of the Digital Age
                </p>
            </div>
        </section>
    )
  }

  return (
    <section className="relative flex items-center justify-center w-full h-screen overflow-hidden">
      {backgrounds.map((bg, index) => {
        const isActive = index === currentBgIndex;
        const commonClass = 'absolute top-0 left-0 object-cover w-full h-full transition-opacity duration-1000 ease-in-out';
        
        if (bg.type === 'video') {
            return (
                <video
                    key={bg.id}
                    src={bg.url}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className={cn(commonClass, isActive ? 'opacity-100' : 'opacity-0')}
                />
            )
        }
        
        return (
            <Image
                key={bg.id}
                src={bg.url}
                alt="Hero background"
                data-ai-hint={bg.hint}
                fill
                className={cn(commonClass, isActive ? 'opacity-100' : 'opacity-0')}
                priority={index === 0}
            />
        )
      })}
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 text-center">
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-widest uppercase font-headline text-metallic">
          RUDYBTZ
        </h1>
        <p className="mt-4 text-lg md:text-xl font-light tracking-wider text-neutral-300 font-body">
          Sonic Architect of the Digital Age
        </p>
      </div>
       <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
        <div className="w-6 h-10 border-2 rounded-full border-accent">
          <div className="w-1 h-2 mx-auto mt-2 rounded-full bg-accent animate-bounce"></div>
        </div>
      </div>
    </section>
  );
}
