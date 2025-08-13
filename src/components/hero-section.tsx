'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const backgrounds = [
  { url: 'https://placehold.co/1920x1080.png', hint: 'neon city' },
  { url: 'https://placehold.co/1920x1080.png', hint: 'abstract data' },
  { url: 'https://placehold.co/1920x1080.png', hint: 'space tunnel' },
];

export default function HeroSection() {
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative flex items-center justify-center w-full h-screen overflow-hidden">
      {backgrounds.map((bg, index) => (
        <Image
          key={index}
          src={bg.url}
          alt="Hero background"
          data-ai-hint={bg.hint}
          fill
          className={cn(
            'object-cover w-full h-full transition-opacity duration-1000 ease-in-out',
            index === currentBgIndex ? 'opacity-100' : 'opacity-0'
          )}
          priority={index === 0}
        />
      ))}
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 text-center text-white">
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-widest uppercase font-headline text-shadow-lg drop-shadow-[0_0_15px_hsl(var(--primary))]">
          RUDYBTZ
        </h1>
        <p className="mt-4 text-lg md:text-xl font-light tracking-wider text-primary-foreground/80 font-body">
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
