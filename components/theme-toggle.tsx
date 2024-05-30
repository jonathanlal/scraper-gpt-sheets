'use client';

import * as React from 'react';
import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <>
      {resolvedTheme === 'dark' ? (
        <Button
          className="w-10"
          variant="outline"
          onClick={() => setTheme('light')}
        >
          <MoonIcon className="absolute h-[1.2rem] w-[1.2rem]" />
        </Button>
      ) : (
        <Button
          className="w-10"
          variant="outline"
          onClick={() => setTheme('dark')}
        >
          <SunIcon className="absolute h-[1.2rem] w-[1.2rem] text-yellow-500" />
        </Button>
      )}
    </>
  );
}
