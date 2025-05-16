import Link from 'next/link';
import { Swords, LogIn } from 'lucide-react';
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
        <div className="flex flex-1 items-center justify-end space-x-2 md:space-x-4">
          {/* Placeholder for future user session display */}
          {/* For now, show Login button. Hide if user is logged in (logic to be added) */}
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">
              <LogIn className="mr-1 h-4 w-4 md:mr-2" />
              Login
            </Link>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
