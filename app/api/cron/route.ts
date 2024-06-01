import getSupabaseServerAdminClient from '@/utils/supabase/getSupabaseAdminClient';
import type { NextRequest } from 'next/server';
import { extract } from '@extractus/feed-extractor';
import {
  DEVELOPMENTS_TABLE,
  GPT_MODEL,
  GPT_SEED,
  PROMPT,
  RSS_URL,
} from '@/utils/constants';
import { getMappedNewEntries } from '@/utils/getMappedNewEntries';
import { calculateGPTCost } from '@/utils/calculateGPTCost';
import OpenAI from 'openai';

export const maxDuration = 60; // This function can run for a maximum of 60 seconds

const cronType = 'FETCH_RSS_AND_GPT';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const startTime = performance.now();
  let entriesFound,
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
        const articleContent = `${entry.title}. ${entry.article_content ?? ''}`;

        const completion = await openai.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant designed to output JSON.',
            },
            {
              role: 'user',
              content: PROMPT,
            },
            {
              role: 'user',
              content: articleContent,
            },
          ],
          model: GPT_MODEL,
          response_format: { type: 'json_object' },
          seed: GPT_SEED,
        });

        const response = completion.choices[0].message.content;
        const total_tokens = completion.usage?.total_tokens ?? 0;

        if (response) {
          const parsedResponse: {
            name_of_development: string;
            location: string;
            rental_or_condo: string | undefined;
            rental_condo: string | undefined;
            developer_or_company: string | undefined;
            developer_company: string | undefined;
            number_of_units: string;
            current_status: string;
          } = JSON.parse(response);

          const price = total_tokens ? calculateGPTCost(total_tokens) : null;

          const { error: updateError } = await supabase
            .from(DEVELOPMENTS_TABLE)
            .update({
              name_of_development: parsedResponse.name_of_development,
              location: parsedResponse.location,
              rental_condo:
                parsedResponse.rental_or_condo ?? parsedResponse.rental_condo,
              developer:
                parsedResponse.developer_or_company ??
                parsedResponse.developer_company,
              number_of_units: parsedResponse.number_of_units,
              status: parsedResponse.current_status,
              gpt_viewed: true,
              gpt_cost: price,
            })
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
