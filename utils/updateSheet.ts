import { TDevelopment } from '@/types/developments';
import { getSheetsClient } from './getSheetsClient';
import { mapDataForSheet } from './mapDataForSheet';
import { SHEET_ID } from './constants';

export const updateSheet = async (data: TDevelopment[]) => {
  try {
    const { glAuth, glSheets } = await getSheetsClient();
    const { headers, values } = mapDataForSheet(data);

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

    return true;
  } catch (error) {
    return false;
  }
};
