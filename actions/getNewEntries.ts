'use server';

import { DEVELOPMENTS_TABLE, RSS_URL } from '@/utils/constants';
import { getMappedNewEntries } from '@/utils/getMappedNewEntries';
import getSupabaseRouteAndActionClient from '@/utils/supabase/getSupabaseRouteAndActionClient';
import { extract } from '@extractus/feed-extractor';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function getNewEntries() {
  try {
    const supabase = await getSupabaseRouteAndActionClient();

    const { data: userData } = await supabase.auth.getUser();
    const currentUser = userData.user;

    if (!currentUser) redirect('/login');

    const { data, error } = await supabase.from(DEVELOPMENTS_TABLE).select('*');

    if (error) {
      return { error: error.message };
    }

    const existingIds: number[] = data.map((entry) => entry.entry_id);

    const rssData = await extract(RSS_URL);

    if (!rssData || !rssData.entries || !rssData.entries.length) {
      return { error: `Could not fetch data from: ${RSS_URL}` };
    }

    const mappedEntries = await getMappedNewEntries(
      existingIds,
      rssData.entries
    );

    if (mappedEntries.length > 0) {
      const { error: insertError } = await supabase
        .from(DEVELOPMENTS_TABLE)
        .insert(mappedEntries);

      if (insertError) {
        return {
          error: insertError.message,
        };
      }

      revalidatePath('/');
      return {
        message: `${mappedEntries.length} new entries found yo`,
      };
    } else {
      return {
        message: 'No new entries bro',
      };
    }
  } catch (error) {
    return { error: 'Some shit went wrong' };
  }
}
