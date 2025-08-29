'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X, Music, Shield } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/components/hooks/use-auth';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAdmin } = useAuth();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'La Trip', href: '/la-trip' },
    { name: 'Bio', href: '/bio' },
    { name: 'Blog', href: '/blog' },
    { name: 'Albums', href: '/albums' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 border-b border-white/10 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <Music className="w-8 h-8 text-violet-400 group-hover:text-violet-300 transition-colors" />
            <span className="text-2xl font-black logo-3d-silver-violet">RUDYBTZ</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="silver-violet-link nav-3d-silver-violet font-medium"
              >
                {item.name}
              </Link>
            ))}
            {user && isAdmin && (
              <Link href="/admin">
                <Button variant="outline" size="sm" className="ml-4 border-violet-400 text-violet-400 hover:bg-violet-400 hover:text-black nav-3d-silver-violet">
                  <Shield className="w-4 h-4 mr-1" />
                  Admin
                </Button>
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white hover:text-cyan-400"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-black/90 rounded-lg mt-2 border border-white/10">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 silver-violet-link nav-3d-silver-violet"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {user && isAdmin && (
                <div className="px-3 py-2">
                  <Link href="/admin">
                    <Button variant="outline" size="sm" className="w-full border-violet-400 text-violet-400 hover:bg-violet-400 hover:text-black nav-3d-silver-violet">
                      <Shield className="w-4 h-4 mr-1" />
                      Admin Dashboard
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
