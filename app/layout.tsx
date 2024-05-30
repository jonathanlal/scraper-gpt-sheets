import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/header';
import getSupabaseServerClient from '@/utils/supabase/getSupabaseServerClient';
import Providers from '@/components/providers';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bleh',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await getSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  const isLoggedIn = userData.user?.id ? true : false;

  const sheetId = process.env.GOOGLE_SHEET_ID!;

  return (
    <html lang="en">
      <head>
        <link rel="icon shortcut" href="/mushroom.ico" type="image/x-icon" />
      </head>
      <body className={inter.className}>
        <Providers>
          {isLoggedIn && <Header sheetId={sheetId} />}
          <div className="container mt-8">{children}</div>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
