'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileSearch, Home, Library, MessageSquareText, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useHealth } from '@/lib/hooks/useStores';
import { SystemPromptSettings } from '@/components/query/SystemPromptSettings';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Stores', href: '/stores', icon: Library },
  { name: 'Upload', href: '/upload', icon: Upload },
  { name: 'Ask', href: '/search', icon: MessageSquareText },
];

function isActive(pathname, href) {
  return href === '/' ? pathname === '/' : pathname.startsWith(href);
}

function ApiStatus() {
  const { isSuccess, isError } = useHealth();
  const label = isSuccess ? 'API online' : isError ? 'API unreachable' : 'Checking API';

  return (
    <span className="hidden md:inline-flex items-center gap-2 text-xs text-muted-foreground" role="status">
      <span
        aria-hidden="true"
        className={cn(
          'h-2 w-2 rounded-full',
          isSuccess ? 'bg-primary' : isError ? 'bg-destructive' : 'bg-muted-foreground/50'
        )}
      />
      {label}
    </span>
  );
}

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center gap-2 sm:gap-6">
        <Link href="/" className="flex items-center gap-2 shrink-0 rounded-md">
          <FileSearch className="h-6 w-6 text-primary" aria-hidden="true" />
          <span className="font-serif text-lg font-semibold hidden sm:inline">File Search</span>
        </Link>

        <nav aria-label="Main" className="flex flex-1 items-center gap-1 overflow-x-auto">
          {navigation.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-2 rounded-md px-2.5 sm:px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-ring',
                  active
                    ? 'bg-secondary text-foreground'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                )}
              >
                <item.icon className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only sm:not-sr-only">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <ApiStatus />
          <SystemPromptSettings />
        </div>
      </div>
    </header>
  );
}
