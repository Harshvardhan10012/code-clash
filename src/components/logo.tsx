import { Swords } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps extends React.SVGProps<SVGSVGElement> {}

export function Logo({ className, ...props }: LogoProps) {
  return (
    <Swords
      className={cn("h-6 w-6 text-primary", className)}
      aria-label="Code Clash Logo"
      {...props}
    />
  );
}
