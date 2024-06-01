import { TDevelopment } from '@/types/developments';

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
    day: 'numeric',
  });
}
export const mapDataForSheet = (data: TDevelopment[]) => {
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

  return { headers, values };
};
