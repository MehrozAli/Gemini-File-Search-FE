'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Database, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SystemPromptSettings } from '@/components/query/SystemPromptSettings';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
];

export function Header({ onClearChat, showChatActions }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-8 flex items-center space-x-2">
          <Database className="h-6 w-6" />
          <span className="font-semibold text-lg">File Search</span>
        </div>
        
        <nav className="flex items-center space-x-1 flex-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          <SystemPromptSettings />
        </div>
      </div>
    </header>
  );
}
