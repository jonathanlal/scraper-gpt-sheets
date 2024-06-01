import getSupabaseServerClient from '@/utils/supabase/getSupabaseServerClient';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';

export default async function Home() {
  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase.from('cron').select('*');

  if (error) {
    return <>Error: {error.message}</>;
  }

  const entries = data || [];

  return (
    <>
      <div className="flex justify-end mb-2">
        <Link
          href="/"
          className="text-lg underline underline-offset-2 text-blue-600"
        >
          Home
        </Link>
      </div>
      {entries.length > 0 && (
        <div className="bg-muted p-0.5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>

                <TableHead>Elapsed</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow
                  key={entry.id}
                  className={`${entry.error_msg && 'bg-red-300'}`}
                >
                  <TableCell>
                    {entry.error_msg ? (
                      entry.error_msg
                    ) : (
                      <>
                        {entry.entries_found} new entries found.{' '}
                        {entry.entries_gpt} processed with GPT.
                      </>
                    )}
                  </TableCell>
                  <TableCell>
                    {(entry.time_took / 1000).toFixed(2) + ' seconds'}
                  </TableCell>
                  <TableCell>
                    {format(parseISO(entry.created_at), 'MMMM d, yyyy h:mm a')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}
