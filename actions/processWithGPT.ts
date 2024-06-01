'use server';

import { DEVELOPMENTS_TABLE } from '@/utils/constants';
import { makeGPTrequest } from '@/utils/makeGPTrequest';
import getSupabaseRouteAndActionClient from '@/utils/supabase/getSupabaseRouteAndActionClient';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import OpenAI from 'openai';

export async function processWithGPT() {
  try {
    const supabase = await getSupabaseRouteAndActionClient();

    const { data: userData } = await supabase.auth.getUser();
    const currentUser = userData.user;

    if (!currentUser) redirect('/login');

    const { data, error } = await supabase
      .from(DEVELOPMENTS_TABLE)
      .select('*')
      .eq('gpt_viewed', false);

    if (error) {
      return { error: error.message };
    }

    if (!data || data.length === 0) {
      return {
        error: 'No new entries to process with GPT',
      };
    }
    const entriesWithContent = data.filter((entry) => entry.article_content);

    const openai = new OpenAI({
      apiKey: process.env.OPEN_AI_API_KEY,
    });

    for (const entry of entriesWithContent) {
      const response = await makeGPTrequest(entry, openai);

      if (response) {
        const { error: updateError } = await supabase
          .from(DEVELOPMENTS_TABLE)
          .update(response)
          .eq('id', entry.id);

        if (updateError) {
          throw new Error(updateError.message);
        }
      } else {
        throw new Error('One of the articles failed to get data from GPT');
      }
    }
    revalidatePath('/');
    return {
      message: 'Successfully processed with GPT',
    };
  } catch (error) {
    return { error: 'Some shit went wrong' };
  }
}
