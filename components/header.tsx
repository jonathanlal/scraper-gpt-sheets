'use client';

import getSupabaseBrowserClient from '@/utils/supabase/getSupabaseBrowserClient';
import { Button } from './ui/button';
import Link from 'next/link';
import { DoorOpen, DoorOpenIcon, ExternalLinkIcon } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';

export const Header = ({ sheetId }: { sheetId: string }) => {
  const supabase = getSupabaseBrowserClient();

  const onLogOut = async () => {
    await supabase.auth.signOut();
    location.href = '/login';
  };

  return (
    <header className="bg-muted p-4 flex justify-between items-center">
      <Link
        href={`https://docs.google.com/spreadsheets/d/${sheetId}/edit?usp=sharing`}
        className="text-sm underline underline-offset-2 text-blue-600"
        target="_blank"
      >
        <span className="flex gap-2 items-center text-lg">
          Sheet
          <ExternalLinkIcon className="w-5 h-5" />
        </span>
      </Link>

      <div className="flex gap-1 items-center">
        <ThemeToggle />
        <Button onClick={onLogOut} variant={'outline'}>
          <DoorOpenIcon className="w-5 h-5 text-red-600" />
        </Button>
      </div>
    </header>
  );
};
