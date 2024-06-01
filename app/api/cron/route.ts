import { DEVELOPMENTS_TABLE, RSS_URL } from '@/utils/constants';
import { getMappedNewEntries } from '@/utils/getMappedNewEntries';
import { makeGPTrequest } from '@/utils/makeGPTrequest';
import getSupabaseServerAdminClient from '@/utils/supabase/getSupabaseAdminClient';
import { updateSheet } from '@/utils/updateSheet';
import { extract } from '@extractus/feed-extractor';
import type { NextRequest } from 'next/server';
import OpenAI from 'openai';

export const maxDuration = 60; // This function can run for a maximum of 60 seconds

const cronType = 'FETCH_RSS_AND_GPT';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const startTime = performance.now();
  let entriesFound = 0,
    entriesGPTd = 0;
  try {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      throw new Error('Unauthorized');
    }

    const supabase = await getSupabaseServerAdminClient();
    const { data, error } = await supabase.from(DEVELOPMENTS_TABLE).select('*');

    if (error) {
      throw new Error(error.message);
    }

    const existingIds: number[] = data.map((entry) => entry.entry_id);
    const rssData = await extract(RSS_URL);

    if (!rssData || !rssData.entries || !rssData.entries.length) {
      throw new Error(`Could not fetch data from: ${RSS_URL}`);
    }

    const mappedEntries = await getMappedNewEntries(
      existingIds,
      rssData.entries
    );

    //if there are new entries to be processed
    if (mappedEntries.length > 0) {
      entriesFound = mappedEntries.length;

      //add to db
      const { error: insertError } = await supabase
        .from(DEVELOPMENTS_TABLE)
        .insert(mappedEntries);

      if (insertError) {
        throw new Error(insertError.message);
      }

      //for each new entry in mappedEntries do the GPT stuff

      const openai = new OpenAI({
        apiKey: process.env.OPEN_AI_API_KEY,
      });

      for (const entry of mappedEntries) {
        const response = await makeGPTrequest(entry, openai);

        if (response) {
          const { error: updateError } = await supabase
            .from(DEVELOPMENTS_TABLE)
            .update(response)
            .eq('entry_id', entry.entry_id);

          if (updateError) {
            throw new Error(updateError.message);
          }
          entriesGPTd = entriesGPTd + 1;
        } else {
          throw new Error(
            `Article with entry_id: ${entry.entry_id} failed to get data from GPT`
          );
        }
      }
    }

    //add data to sheets
    if (entriesFound > 0 && entriesGPTd > 0) {
      const { data } = await supabase
        .from(DEVELOPMENTS_TABLE)
        .select('*')
        .eq('gpt_viewed', true);

      if (data && data.length > 0) {
        await updateSheet(data);
      }
    }
  } catch (e) {
    const errorMsg = (e as Error).message;

    const supabase = await getSupabaseServerAdminClient();
    await supabase.from('cron').insert({
      type: cronType,
      error_msg: errorMsg,
      time_took: performance.now() - startTime,
    });
    return new Response(errorMsg, { status: 500 });
  }

  const supabase = await getSupabaseServerAdminClient();

  await supabase.from('cron').insert({
    type: cronType,
    time_took: performance.now() - startTime,
    entries_found: entriesFound,
    entries_gpt: entriesGPTd,
  });

  return Response.json({ success: true });
}
