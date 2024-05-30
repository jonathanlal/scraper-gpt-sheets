'use client';
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';
import { useEffect } from 'react';
import React from 'react';

const ThemeSwitcher = ({ children }: { children: React.ReactNode }) => {
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    if (resolvedTheme) {
      setTheme(resolvedTheme);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedTheme]);

  return <>{children}</>;
};

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      enableSystem
      defaultTheme="system"
      storageKey="theme"
      disableTransitionOnChange
    >
      <ThemeSwitcher>{children}</ThemeSwitcher>
    </NextThemesProvider>
  );
}

export default Providers;
