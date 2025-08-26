'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Instagram, Twitter, Youtube, Music2, ExternalLink } from 'lucide-react';
import { useState } from 'react';

const socialLinks = [
  {
    name: 'Instagram',
    icon: Instagram,
    url: 'https://instagram.com/rudybtz',
    color: 'hover:text-pink-400'
  },
  {
    name: 'Twitter',
    icon: Twitter,
    url: 'https://twitter.com/rudybtz',
    color: 'hover:text-blue-400'
  },
  {
    name: 'YouTube',
    icon: Youtube,
    url: 'https://youtube.com/@rudybtz',
    color: 'hover:text-red-500'
  },
  {
    name: 'SoundCloud',
    icon: Music2,
    url: 'https://soundcloud.com/rudybtz',
    color: 'hover:text-orange-400'
  }
];

const milestones = [
  {
    year: '2020',
    title: 'First Release',
    description: 'Debut single "Digital Dreams" launched on all major platforms'
  },
  {
    year: '2021',
    title: 'Breakthrough Year',
    description: 'Featured on Spotify\'s Electronic Rising playlist'
  },
  {
    year: '2022',
    title: 'International Recognition',
    description: 'Performed at major electronic music festivals across Europe'
  },
  {
    year: '2023',
    title: 'Studio Album',
    description: 'Released critically acclaimed album "Quantum Beats"'
  },
  {
    year: '2024',
    title: 'Innovation Era',
    description: 'Pioneering AI-assisted music production techniques'
  }
];

export default function BioSection() {
  const [selectedMilestone, setSelectedMilestone] = useState<number | null>(null);

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black tracking-wider uppercase font-headline text-metallic mb-6">
            About the Artist
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Discover the journey behind the sound, the vision driving the music, 
            and the technology shaping the future of electronic production.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Artist Profile */}
          <div className="space-y-8">
            {/* Profile Image */}
            <div className="relative w-64 h-64 mx-auto lg:mx-0">
              <Image
                src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=400"
                alt="RUDYBTZ Artist Photo"
                fill
                className="object-cover rounded-full border-4 border-accent/20"
                sizes="256px"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-accent/20" />
            </div>

            {/* Bio Text */}
            <div className="space-y-6 text-center lg:text-left">
              <h3 className="text-2xl font-bold font-headline text-metallic">
                RUDYBTZ
              </h3>
              
              <div className="space-y-4 text-foreground/80 leading-relaxed">
                <p>
                  Electronic music producer and innovative sound designer pushing the boundaries 
                  of modern music production. With a background in both traditional music theory 
                  and cutting-edge technology, RUDYBTZ creates immersive sonic experiences that 
                  blend organic elements with digital precision.
                </p>
                
                <p>
                  Drawing inspiration from cyberpunk aesthetics, futuristic soundscapes, and 
                  the endless possibilities of AI-assisted creation, each track tells a story 
                  of technological evolution and human creativity working in harmony.
                </p>
                
                <p>
                  From intimate studio sessions to massive festival stages, the music of RUDYBTZ 
                  has captivated audiences worldwide, earning recognition for its innovative 
                  production techniques and emotionally resonant compositions.
                </p>
              </div>

              {/* Social Links */}
              <div className="flex justify-center lg:justify-start space-x-4 pt-6">
                {socialLinks.map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <Button
                      key={link.name}
                      variant="outline"
                      size="icon"
                      className={`glassmorphism bg-card/50 hover:bg-card/70 transition-all ${link.color}`}
                      asChild
                    >
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Follow on ${link.name}`}
                      >
                        <IconComponent className="w-5 h-5" />
                      </a>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-8">
            <h3 className="text-2xl font-bold font-headline text-metallic text-center lg:text-left">
              Musical Journey
            </h3>
            
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-accent via-primary to-accent/50" />
              
              {/* Timeline Items */}
              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <div 
                    key={index}
                    className="relative pl-12 cursor-pointer group"
                    onClick={() => setSelectedMilestone(selectedMilestone === index ? null : index)}
                  >
                    {/* Timeline Dot */}
                    <div className={`absolute left-0 w-8 h-8 rounded-full border-2 transition-all ${
                      selectedMilestone === index 
                        ? 'bg-accent border-accent scale-125' 
                        : 'bg-background border-accent/50 group-hover:border-accent group-hover:scale-110'
                    }`}>
                      <div className="absolute inset-2 rounded-full bg-accent/20" />
                    </div>

                    {/* Content */}
                    <div className={`glassmorphism bg-card/30 p-6 rounded-xl transition-all ${
                      selectedMilestone === index 
                        ? 'bg-card/50 shadow-lg shadow-accent/10' 
                        : 'group-hover:bg-card/40'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-accent font-bold text-lg">
                          {milestone.year}
                        </span>
                        <ExternalLink className="w-4 h-4 text-foreground/40 group-hover:text-accent transition-colors" />
                      </div>
                      
                      <h4 className="font-bold font-headline text-metallic mb-2">
                        {milestone.title}
                      </h4>
                      
                      <p className={`text-foreground/70 transition-all ${
                        selectedMilestone === index ? 'text-foreground/90' : ''
                      }`}>
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 pt-16 border-t border-border/20">
          <h3 className="text-2xl font-bold font-headline text-metallic mb-4">
            Let's Create Something Amazing
          </h3>
          <p className="text-foreground/70 mb-8 max-w-2xl mx-auto">
            Interested in collaborations, bookings, or just want to connect? 
            Reach out and let's explore the possibilities of sound together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="glassmorphism bg-accent/20 hover:bg-accent/30 border border-accent/30">
              Get In Touch
            </Button>
            <Button variant="outline" size="lg">
              View Press Kit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}