'use server';

import { calculateGPTCost } from '@/utils/calculateGPTCost';
import {
  DEVELOPMENTS_TABLE,
  GPT_MODEL,
  GPT_SEED,
  PROMPT,
} from '@/utils/constants';
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

    for (const entry of entriesWithContent) {
      const articleContent = `${entry.title}. ${entry.article_content ?? ''}`;

      const openai = new OpenAI({
        apiKey: process.env.OPEN_AI_API_KEY,
      });

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
