import { google } from 'googleapis';

export const getSheetsClient = async () => {
  const glAuth = await google.auth.getClient({
    projectId: 'ybmiy-424823',
    credentials: JSON.parse(process.env.GOOGLE_X_JSON!),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const glSheets = google.sheets({ version: 'v4', auth: glAuth });

  return { glAuth, glSheets };
};
