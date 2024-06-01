import { TableView } from '@/components/table-view';
import { Alert } from '@/components/ui/alert';
import { DEVELOPMENTS_TABLE } from '@/utils/constants';
import getSupabaseServerClient from '@/utils/supabase/getSupabaseServerClient';
import Link from 'next/link';

export default async function Home() {
  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase.from(DEVELOPMENTS_TABLE).select('*');

  if (error) {
    return <>Error: {error.message}</>;
  }

  const entries = data || [];

  return (
    <>
      <div className="flex justify-end">
        <Link
          href="/logs"
          className="text-lg underline underline-offset-2 text-blue-600"
        >
          Logs
        </Link>
      </div>
      <Alert className="mb-4 mt-2">
        <div className="flex flex-col gap-1">
          <div className="flex gap-2 items-center">
            <div className="w-5 h-5 bg-purple-300" />
            <span>In sheet & processed</span>
          </div>
          <div className="flex gap-2 items-center">
            <div className="w-5 h-5 bg-green-300" />
            <span>Ready to add to sheet</span>
          </div>
          <div className="flex gap-2 items-center">
            <div className="w-5 h-5 bg-red-300" />
            <span>Not processed by chatgpt</span>
          </div>
        </div>
      </Alert>
      <TableView entries={entries} />
    </>
  );
}
