'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const backgrounds = [
  { type: 'image', url: 'https://placehold.co/1920x1080.png', hint: 'glitch art' },
  { type: 'video', url: 'https://cdn.pixabay.com/video/2022/10/20/135158-765063811_large.mp4', hint: 'cyberpunk circuit' },
  { type: 'image', url: 'https://placehold.co/1920x1080.png', hint: 'digital noise' },
  { type: 'video', url: 'https://cdn.pixabay.com/video/2024/05/27/211518-944207914_large.mp4', hint: 'abstract animation' },
  { type: 'image', url: 'https://placehold.co/1920x1080.png', hint: 'neon data stream' },
];

export default function HeroSection() {
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
    }, 7000); // Increased interval for videos

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative flex items-center justify-center w-full h-screen overflow-hidden">
      {backgrounds.map((bg, index) => {
        const isActive = index === currentBgIndex;
        const commonClass = 'absolute top-0 left-0 object-cover w-full h-full transition-opacity duration-1000 ease-in-out';
        
        if (bg.type === 'video') {
            return (
                <video
                    key={index}
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
                key={index}
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
      <div className="relative z-10 text-center text-white">
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-br from-white via-neutral-300 to-neutral-500 drop-shadow-2xl font-headline">
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
