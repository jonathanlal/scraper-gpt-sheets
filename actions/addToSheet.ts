'use server';
import { DEVELOPMENTS_TABLE } from '@/utils/constants';
import getSupabaseRouteAndActionClient from '@/utils/supabase/getSupabaseRouteAndActionClient';
import { updateSheet } from '@/utils/updateSheet';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export const addToSheet = async () => {
  try {
    const supabase = await getSupabaseRouteAndActionClient();

    const { data: userData } = await supabase.auth.getUser();
    const currentUser = userData.user;

    if (!currentUser) redirect('/login');

    const { data, error } = await supabase
      .from(DEVELOPMENTS_TABLE)
      .select('*')
      .eq('gpt_viewed', true);

    if (error) {
      return { error: error.message };
    }

    if (!data || data.length === 0) {
      return {
        error: 'Dude - make sure you have green rows in the table!',
      };
    }

    const hasUpdatedSheet = await updateSheet(data);

    if (hasUpdatedSheet) {
      for (const entry of data) {
        await supabase
          .from(DEVELOPMENTS_TABLE)
          .update({ in_sheet: true })
          .eq('id', entry.id);
      }
      revalidatePath('/');
      return {
        message: `Sheet updated!`,
      };
    } else {
      return {
        error: 'Could not update Sheet.',
      };
    }
  } catch (error) {
    return {
      error: 'Shit, something went down.',
    };
  }

  // return { data: data.data.values };
};
