'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Play, Pause, ListMusic, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Track {
  id: string;
  title: string;
  duration: string;
  url?: string;
}

interface Album {
  id: string;
  title: string;
  releaseYear: number;
  coverArt: string;
  tracks: Track[];
}

const sampleAlbums: Album[] = [
  {
    id: '1',
    title: 'Neon Horizons',
    releaseYear: 2024,
    coverArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=2070',
    tracks: [
      { id: '1', title: 'Digital Dreams', duration: '4:23' },
      { id: '2', title: 'Cyber City', duration: '3:45' },
      { id: '3', title: 'Electric Soul', duration: '5:12' },
      { id: '4', title: 'Future Funk', duration: '4:08' },
      { id: '5', title: 'Neon Lights', duration: '3:56' }
    ]
  },
  {
    id: '2',
    title: 'Quantum Beats',
    releaseYear: 2023,
    coverArt: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?q=80&w=2070',
    tracks: [
      { id: '6', title: 'Particle Wave', duration: '4:45' },
      { id: '7', title: 'Frequency Shift', duration: '3:28' },
      { id: '8', title: 'Quantum Entanglement', duration: '6:15' },
      { id: '9', title: 'Binary Code', duration: '4:02' }
    ]
  },
  {
    id: '3',
    title: 'Synthwave Odyssey',
    releaseYear: 2023,
    coverArt: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070',
    tracks: [
      { id: '10', title: 'Retro Future', duration: '5:23' },
      { id: '11', title: 'Analog Dreams', duration: '4:17' },
      { id: '12', title: 'Synthwave Nights', duration: '3:54' },
      { id: '13', title: 'Time Machine', duration: '4:36' },
      { id: '14', title: 'Nostalgic Waves', duration: '5:08' }
    ]
  }
];

export default function AlbumShowcase() {
  const [albums] = useState<Album[]>(sampleAlbums);
  const [nowPlaying, setNowPlaying] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying && nowPlaying?.url) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, nowPlaying]);

  const handlePlayPause = (track: Track) => {
    if (!track.url) return;
    
    if (nowPlaying?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setNowPlaying(track);
      setIsPlaying(true);
    }
  };

  const getTotalDuration = (tracks: Track[]) => {
    // Convert duration strings to total minutes
    const totalMinutes = tracks.reduce((sum, track) => {
      const [minutes, seconds] = track.duration.split(':').map(Number);
      return sum + (minutes || 0) + (seconds || 0) / 60;
    }, 0);
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-6xl font-black tracking-wider uppercase font-headline text-metallic mb-6">
          Discography
        </h2>
        <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
          Explore the sonic journeys crafted by RUDYBTZ. Each album is a unique universe of sound, 
          blending electronic elements with cutting-edge production techniques.
        </p>
      </div>

      <div className="space-y-16">
        {albums.map((album, index) => (
          <Card 
            key={album.id} 
            className="overflow-hidden border-0 glassmorphism bg-card/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500"
          >
            <div className={cn("grid md:grid-cols-2", index % 2 === 1 && "md:grid-cols-2")}>
              {/* Album Cover */}
              <div className={cn("relative aspect-square", index % 2 === 1 && "md:order-2")}>
                <Image
                  src={album.coverArt}
                  alt={`${album.title} cover art`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Album Info Overlay */}
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="flex items-center gap-2 text-sm text-white/80 mb-2">
                    <Clock className="w-4 h-4" />
                    <span>{album.tracks.length} tracks • {getTotalDuration(album.tracks)}</span>
                  </div>
                </div>
              </div>

              {/* Album Details */}
              <div className={cn("flex flex-col p-6 md:p-8", index % 2 === 1 && "md:order-1")}>
                <div className="flex-grow">
                  <div className="mb-6">
                    <h3 className="text-3xl md:text-4xl font-bold font-headline text-metallic mb-2">
                      {album.title}
                    </h3>
                    <p className="text-xl text-accent font-semibold">
                      {album.releaseYear}
                    </p>
                  </div>

                  {/* Tracklist */}
                  <div className="mb-8">
                    <h4 className="flex items-center gap-2 text-lg font-semibold font-headline text-metallic mb-4">
                      <ListMusic className="w-5 h-5 text-accent" />
                      Tracklist
                    </h4>
                    
                    <ScrollArea className="h-64">
                      <div className="space-y-2 pr-4">
                        {album.tracks.map((track, trackIndex) => (
                          <div
                            key={track.id}
                            className={cn(
                              "flex items-center justify-between p-3 rounded-lg transition-all cursor-pointer group",
                              track.url 
                                ? "hover:bg-accent/10" 
                                : "opacity-60 cursor-not-allowed",
                              nowPlaying?.id === track.id && "bg-accent/20"
                            )}
                            onClick={() => track.url && handlePlayPause(track)}
                          >
                            <div className="flex items-center gap-3">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="w-8 h-8 flex-shrink-0"
                                disabled={!track.url}
                              >
                                {nowPlaying?.id === track.id && isPlaying ? (
                                  <Pause className="w-4 h-4 text-accent" />
                                ) : (
                                  <Play className="w-4 h-4" />
                                )}
                              </Button>
                              
                              <div>
                                <span className="text-sm text-foreground/50 mr-3">
                                  {(trackIndex + 1).toString().padStart(2, '0')}.
                                </span>
                                <span className={cn(
                                  "font-medium transition-colors",
                                  nowPlaying?.id === track.id && "text-accent"
                                )}>
                                  {track.title}
                                </span>
                              </div>
                            </div>
                            
                            <span className="text-sm text-foreground/50 flex-shrink-0">
                              {track.duration}
                            </span>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </div>

                {/* Album Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button className="flex-1" size="lg">
                    <Play className="w-4 h-4 mr-2" />
                    Play Album
                  </Button>
                  <Button variant="outline" className="flex-1" size="lg">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
        onError={() => {
          setIsPlaying(false);
          console.error('Audio playback failed');
        }}
      />
    </div>
  );
}