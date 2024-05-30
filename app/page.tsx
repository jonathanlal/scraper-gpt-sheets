import { TableView } from '@/components/table-view';
import { DEVELOPMENTS_TABLE } from '@/utils/constants';
import getSupabaseServerAdminClient from '@/utils/supabase/getSupabaseAdminClient';

export default async function Home() {
  const supabase = await getSupabaseServerAdminClient();

  const { data, error } = await supabase.from(DEVELOPMENTS_TABLE).select('*');

  if (error) {
    return <>Error: {error.message}</>;
  }

  const entries = data || [];

  return (
    <>
      <div className="flex flex-col gap-1 mb-4">
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
      <TableView entries={entries} />
    </>
  );
}
