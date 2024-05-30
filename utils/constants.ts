export const RSS_URL = `${process.env.TARGET_DOMAIN!}/feed`;
export const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
export const DEVELOPMENTS_TABLE =
  process.env.ENVIRONMENT === 'prod' ? 'developments' : 'developments_dev';

export const PROMPT =
  'Please identify and extract the following information from the article provided: 1. Name of Development (Name or exact address) 2. Location (area) 3. Rental/Condo (Is it a rental or a condo? Other options can include: Mixed-Use, Commercial, Community Facility, Student, Condominium or if it doesnt specify pick something you think might best describe it etc...) 4. Developer or Company behind it 5. Number of Units (Not Listed, Number or estimate) 6. Current Status (Opened, Housing Lottery Launched, Permits Filed, Topped Out, Façade Installation, Construction Completed, Reached Pinnacle, Leasing Begun, Design Unveiled, Nearing Completion, Renderings Released, Foundations Underway, Agreement Reached, Under Construction etc.) - Format the extracted information in a structured JSON format - the fields should be snake_case and the values should be strings. If any information is not available, please provide a placeholder value such as "Not listed" or "Location not available" or try and find content that might fit the field if possible. Thank you for your help! Here is the article: ';

export const GPT_MODEL = 'gpt-3.5-turbo-0125';

export const GPT_SEED = 69;
