'use server';
import process from 'process';
import { google } from 'googleapis';
import getSupabaseRouteAndActionClient from '@/utils/supabase/getSupabaseRouteAndActionClient';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { DEVELOPMENTS_TABLE, SHEET_ID } from '@/utils/constants';

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
    day: 'numeric',
  });
}
export const addToSheet = async () => {
  try {
    const supabase = await getSupabaseRouteAndActionClient();

    const { data: userData } = await supabase.auth.getUser();
    const currentUser = userData.user;

    if (!currentUser) redirect('/login');

    const glAuth = await google.auth.getClient({
      projectId: 'ybmiy-424823',
      credentials: JSON.parse(process.env.GOOGLE_X_JSON!),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const glSheets = google.sheets({ version: 'v4', auth: glAuth });

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

    const headers = [
      'Name of Development',
      'Location',
      'Rental/Condo',
      'Developer',
      'Number of Units',
      'Status',
      'Published Date',
    ];

    const values = data.map((entry) => [
      entry.name_of_development,
      entry.location,
      entry.rental_condo,
      entry.developer,
      entry.number_of_units,
      entry.status,
      formatDate(entry.published_date!), // Assuming published_date is a Date object, format it to YYYY-MM-DD
    ]);

    //clear all values in the sheet
    await glSheets.spreadsheets.values.clear({
      auth: glAuth,
      spreadsheetId: SHEET_ID,
      range: 'A1:Z',
    });

    await glSheets.spreadsheets.values.append({
      auth: glAuth,
      spreadsheetId: SHEET_ID,
      insertDataOption: 'OVERWRITE',
      valueInputOption: 'USER_ENTERED',
      range: 'A1',
      requestBody: {
        values: [headers, ...values],
      },
    });

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
  } catch (error) {
    return {
      error: 'Shit, something went down.',
    };
  }

  // return { data: data.data.values };
};
