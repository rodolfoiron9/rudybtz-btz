'use client';

import Link from 'next/link';
import { Button } from './ui/button';
import { Twitter, Instagram, Youtube } from 'lucide-react';
import { SoundcloudIcon } from './icons';
import useLocalStorage from '@/hooks/use-local-storage';
import { initialProfile } from '@/lib/data';
import type { Profile } from '@/lib/types';


export default function Footer() {
  const [profile] = useLocalStorage<Profile>('rudybtz-profile', initialProfile);

  const socialIcons = {
    twitter: <Twitter />,
    instagram: <Instagram />,
    youtube: <Youtube />,
    soundcloud: <SoundcloudIcon />,
  };

  return (
    <footer className="py-8 border-t border-white/10">
      <div className="container flex flex-col items-center justify-between gap-6 mx-auto md:flex-row">
        <p className="text-sm text-foreground/50">
          &copy; {new Date().getFullYear()} RUDYBTZ. All Rights Reserved.
        </p>
        <div className="flex items-center gap-2">
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
    </footer>
  );
}
