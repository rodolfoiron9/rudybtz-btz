'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import useLocalStorage from '@/hooks/use-local-storage';
import { initialAlbums } from '@/lib/data';
import type { Album } from '@/lib/types';
import { ListMusic } from 'lucide-react';

export default function AlbumShowcase() {
  const [albums] = useLocalStorage<Album[]>('rudybtz-albums', initialAlbums);

  return (
    <div className="container mx-auto">
      <div className="text-center">
        <h2 className="mb-4 text-4xl font-black tracking-wider uppercase md:text-6xl font-headline">Discography</h2>
        <p className="max-w-2xl mx-auto mb-12 text-lg text-foreground/70">
          Explore the sonic journeys crafted by RUDYBTZ. Each album is a unique universe of sound.
        </p>
      </div>
      <div className="space-y-12">
        {albums.map((album) => (
          <Card key={album.id} className="overflow-hidden transition-all duration-300 border-0 glassmorphism bg-card/50 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-1">
            <div className="grid md:grid-cols-2">
                <div className="relative aspect-square">
                    <Image
                    src={album.coverArt}
                    alt={`${album.title} cover art`}
                    data-ai-hint="album cover"
                    fill
                    className="object-cover"
                    />
                </div>
                <div className="flex flex-col p-6 text-left md:p-8">
                    <h3 className="text-3xl font-bold md:text-4xl font-headline drop-shadow-[0_0_8px_hsl(var(--primary))]">{album.title}</h3>

                    <div className="flex flex-col flex-grow mt-6">
                        <h4 className="flex items-center gap-2 mb-3 text-lg font-semibold font-headline"><ListMusic className="w-5 h-5 text-accent" /> Tracklist</h4>
                        <ScrollArea className="h-56 pr-4 -mr-4">
                          <ul className="space-y-3">
                          {album.tracks.map((track, index) => (
                              <li key={track.id} className="flex items-center justify-between p-2 rounded-md bg-white/5">
                              <div className="flex items-center">
                                  <span className="mr-3 text-sm text-foreground/50">{index + 1}.</span>
                                  <p>{track.title}</p>
                              </div>
                              <span className="text-sm text-foreground/50">{track.duration}</span>
                              </li>
                          ))}
                          </ul>
                        </ScrollArea>
                    </div>
                    <p className="mt-4 text-lg text-center text-accent font-headline drop-shadow-[0_0_5px_hsl(var(--accent))]">{album.releaseYear}</p>
                </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
