import { TDevelopment } from '@/types/developments';
import OpenAI from 'openai';
import { GPT_MODEL, GPT_SEED, PROMPT } from './constants';
import { calculateGPTCost } from './calculateGPTCost';

export const makeGPTrequest = async (
  entry: Pick<TDevelopment, 'article_content' | 'title'>,
  openAIClient: OpenAI
) => {
  const articleContent = `${entry.title}. ${entry.article_content ?? ''}`;

  const completion = await openAIClient.chat.completions.create({
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
  const price = total_tokens ? calculateGPTCost(total_tokens) : null;

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

    //return format for DB
    return {
      name_of_development: parsedResponse.name_of_development,
      location: parsedResponse.location,
      rental_condo:
        parsedResponse.rental_or_condo ?? parsedResponse.rental_condo,
      developer:
        parsedResponse.developer_or_company ?? parsedResponse.developer_company,
      number_of_units: parsedResponse.number_of_units,
      status: parsedResponse.current_status,
      gpt_viewed: true,
      gpt_cost: price,
    };
  } else {
    return null;
  }
};
