'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Music, UserCircle, Bot, Map } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} className="text-sm font-medium transition-colors text-foreground/70 hover:text-foreground">
    {children}
  </Link>
);

const MobileNavLink = ({ href, children, onOpenChange }: { href: string; children: React.ReactNode, onOpenChange: (open: boolean) => void }) => (
    <Link href={href} className="flex items-center gap-4 px-4 py-3 text-lg font-semibold transition-colors rounded-lg text-foreground/80 hover:bg-white/10 hover:text-foreground" onClick={() => onOpenChange(false)}>
    {children}
  </Link>
)

export default function Header() {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = React.useState(false);

  if (isMobile) {
    return (
       <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <header className="fixed top-0 left-0 right-0 z-40 p-4">
            <div className="flex items-center justify-between p-2 px-4 rounded-lg glassmorphism">
                <Link href="/" className="text-lg font-black tracking-wider uppercase font-headline">
                RUDYBTZ
                </Link>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-foreground">
                        <Menu />
                    </Button>
                </SheetTrigger>
            </div>
        </header>
        <SheetContent side="top" className="p-4 pt-20 border-b-0 glassmorphism bg-background/80">
            <nav className="flex flex-col gap-2">
                <MobileNavLink href="/#albums" onOpenChange={setIsOpen}><Music className="w-5 h-5 text-accent"/>Albums</MobileNavLink>
                <MobileNavLink href="/#roadmap" onOpenChange={setIsOpen}><Map className="w-5 h-5 text-accent"/>Roadmap</MobileNavLink>
                <MobileNavLink href="/#bio" onOpenChange={setIsOpen}><UserCircle className="w-5 h-5 text-accent"/>Bio</MobileNavLink>
                <MobileNavLink href="/chat" onOpenChange={setIsOpen}><Bot className="w-5 h-5 text-accent"/>Chat</MobileNavLink>
                <div className="pt-4 mt-4 border-t border-white/10">
                    <Link href="/admin">
                         <Button variant="outline" className="w-full text-lg font-semibold border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                             Admin Panel
                         </Button>
                    </Link>
                </div>
            </nav>
        </SheetContent>
       </Sheet>
    )
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 p-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between px-6 py-3 rounded-lg glassmorphism">
          <Link href="/" className="text-2xl font-black tracking-wider uppercase font-headline">
            RUDYBTZ
          </Link>
          <nav className="flex items-center gap-6">
            <NavLink href="/#albums">Albums</NavLink>
            <NavLink href="/#roadmap">Roadmap</NavLink>
            <NavLink href="/#bio">Bio</NavLink>
            <NavLink href="/chat">Chat</NavLink>
            <Link href="/admin">
              <Button variant="outline" size="sm" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                Admin
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
