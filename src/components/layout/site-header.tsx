import Link from 'next/link';
import { Swords, BarChart3, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { MainNav } from '@/components/layout/main-nav';
import { MobileNav } from '@/components/layout/mobile-nav';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <MainNav />
        <MobileNav />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            {/* Add user auth related buttons here later */}
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
