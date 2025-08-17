'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import useLocalStorage from '@/hooks/use-local-storage';
import { initialProfile } from '@/lib/data';
import type { Profile } from '@/lib/types';
import { Twitter, Instagram, Youtube } from 'lucide-react';
import { SoundcloudIcon } from './icons';

export default function BioSection() {
  const [profile] = useLocalStorage<Profile>('rudybtz-profile', initialProfile);

  const socialIcons = {
    twitter: <Twitter />,
    instagram: <Instagram />,
    youtube: <Youtube />,
    soundcloud: <SoundcloudIcon />,
  };

  return (
    <div className="container relative z-10 mx-auto">
      <div className="grid items-center gap-12 md:grid-cols-3">
        <div className="relative w-full mx-auto md:w-auto aspect-square">
          <div className="relative z-10 w-full h-full rounded-lg">
             <Image
                src={profile.profileImage}
                alt="RUDYBTZ profile image"
                data-ai-hint="dj portrait"
                fill
                className="object-cover rounded-full shadow-2xl shadow-primary/30"
              />
          </div>
          <div className="absolute inset-0 rounded-full bg-primary/50 blur-2xl animate-pulse"></div>
        </div>
        <div className="md:col-span-2">
          <h2 className="mb-4 text-4xl font-black tracking-wider uppercase md:text-6xl font-headline text-metallic">The Artist</h2>
          <p className="mb-8 text-lg leading-relaxed text-foreground/80">
            {profile.bio}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <p className="mr-4 font-bold text-metallic">Follow on:</p>
            {Object.entries(profile.socials)
              .filter(([, url]) => url)
              .map(([key, url]) => (
              <Button key={key} asChild variant="ghost" size="icon" className="transition-colors rounded-full text-foreground/70 hover:bg-accent/20 hover:text-accent">
                <Link href={url} target="_blank" aria-label={`Follow on ${key}`}>
                  {socialIcons[key as keyof typeof socialIcons]}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
