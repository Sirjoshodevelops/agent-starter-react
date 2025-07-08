'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { MonitorIcon, MoonIcon, SunIcon } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn(
          'text-foreground bg-background flex w-full flex-row justify-end divide-x overflow-hidden rounded-full border',
          className
        )}
        style={{ visibility: 'hidden', pointerEvents: 'none' }}
      >
        <span className="sr-only">Color scheme toggle</span>
        <button
          type="button"
          onClick={() => setTheme('dark')}
          className="cursor-pointer p-1 pl-1.5"
          suppressHydrationWarning
        >
          <span className="sr-only">Enable dark color scheme</span>
          <MoonIcon size={16} weight="bold" />
        </button>
        <button
          type="button"
          onClick={() => setTheme('light')}
          className="cursor-pointer px-1.5 py-1"
          suppressHydrationWarning
        >
          <span className="sr-only">Enable light color scheme</span>
          <SunIcon size={16} weight="bold" />
        </button>
        <button
          type="button"
          onClick={() => setTheme('system')}
          className="cursor-pointer p-1 pr-1.5"
          suppressHydrationWarning
        >
          <span className="sr-only">Enable system color scheme</span>
          <MonitorIcon size={16} weight="bold" />
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'text-foreground bg-background flex w-full flex-row justify-end divide-x overflow-hidden rounded-full border',
        className
      )}
      style={{ visibility: 'visible', pointerEvents: 'auto' }}
    >
      <span className="sr-only">Color scheme toggle</span>
      <button
        type="button"
        onClick={() => setTheme('dark')}
        className="cursor-pointer p-1 pl-1.5"
        suppressHydrationWarning
      >
        <span className="sr-only">Enable dark color scheme</span>
        <MoonIcon size={16} weight="bold" className={cn(theme !== 'dark' && 'opacity-25')} />
      </button>
      <button
        type="button"
        onClick={() => setTheme('light')}
        className="cursor-pointer px-1.5 py-1"
        suppressHydrationWarning
      >
        <span className="sr-only">Enable light color scheme</span>
        <SunIcon size={16} weight="bold" className={cn(theme !== 'light' && 'opacity-25')} />
      </button>
      <button
        type="button"
        onClick={() => setTheme('system')}
        className="cursor-pointer p-1 pr-1.5"
        suppressHydrationWarning
      >
        <span className="sr-only">Enable system color scheme</span>
        <MonitorIcon size={16} weight="bold" className={cn(theme !== 'system' && 'opacity-25')} />
      </button>
    </div>
  );
}
