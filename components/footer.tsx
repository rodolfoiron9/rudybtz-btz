'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Music, Heart, Github, Mail, Instagram, Twitter, Youtube } from 'lucide-react';

const socialLinks = [
  { icon: Instagram, href: 'https://instagram.com/rudybtz', label: 'Instagram' },
  { icon: Twitter, href: 'https://twitter.com/rudybtz', label: 'Twitter' },
  { icon: Youtube, href: 'https://youtube.com/@rudybtz', label: 'YouTube' },
  { icon: Github, href: 'https://github.com/rudybtz', label: 'GitHub' },
];

const quickLinks = [
  { name: 'Albums', href: '#albums' },
  { name: 'About', href: '#bio' },
  { name: 'Contact', href: '#contact' },
  { name: 'Admin', href: '/admin' },
];

const legalLinks = [
  { name: 'Privacy Policy', href: '/privacy' },
  { name: 'Terms of Service', href: '/terms' },
  { name: 'Copyright', href: '/copyright' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border/20">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Music className="w-8 h-8 text-primary" />
              <span className="text-2xl font-black font-headline text-metallic">RUDYBTZ</span>
            </div>
            <p className="text-foreground/70 mb-6 max-w-md">
              Electronic music producer crafting immersive sonic experiences through innovative 
              sound design and cutting-edge production techniques.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-3">
              {socialLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <Button
                    key={link.label}
                    variant="outline"
                    size="icon"
                    className="glassmorphism bg-card/30 hover:bg-card/50 transition-all"
                    asChild
                  >
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                    >
                      <IconComponent className="w-4 h-4" />
                    </a>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold font-headline text-metallic mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-foreground/70 hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold font-headline text-metallic mb-4">
              Get In Touch
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-foreground/60 mb-1">Bookings</p>
                <a
                  href="mailto:bookings@rudybtz.com"
                  className="text-foreground/70 hover:text-accent transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  bookings@rudybtz.com
                </a>
              </div>
              <div>
                <p className="text-sm text-foreground/60 mb-1">General</p>
                <a
                  href="mailto:hello@rudybtz.com"
                  className="text-foreground/70 hover:text-accent transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  hello@rudybtz.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="glassmorphism bg-card/30 p-6 rounded-xl mb-8">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-xl font-bold font-headline text-metallic mb-2">
              Stay Updated
            </h3>
            <p className="text-foreground/70 mb-4">
              Get notified about new releases, shows, and exclusive content.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                aria-label="Email address for newsletter"
              />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="flex items-center gap-2 text-foreground/60">
              <span>© {currentYear} RUDYBTZ. Made with</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span>and cutting-edge tech.</span>
            </div>

            {/* Legal Links */}
            <div className="flex space-x-6">
              {legalLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm text-foreground/60 hover:text-accent transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Tech Credits */}
          <div className="mt-4 text-center">
            <p className="text-xs text-foreground/50">
              Built with Next.js 15, TypeScript, Tailwind CSS, Firebase & AI Integration
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}