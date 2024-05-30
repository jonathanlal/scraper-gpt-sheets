'use client';

import { addToSheet } from '@/actions/addToSheet';
import { getNewEntries } from '@/actions/getNewEntries';
import { processWithGPT } from '@/actions/processWithGPT';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TDevelopment } from '@/types/developments';
import { Disc3Icon } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { toast } from './ui/use-toast';
import { parseISO, format } from 'date-fns';

const getStatusColor = (entry: any) => {
  const isGptViewed: boolean = entry.gpt_viewed;
  const isInSheet: boolean = entry.in_sheet;

  if (isGptViewed && isInSheet) {
    return 'bg-purple-300';
  }

  if (isGptViewed && !isInSheet) {
    return 'bg-green-300';
  }
  if (!isGptViewed && !isInSheet) {
    return 'bg-red-300';
  }
};

export const TableView = ({ entries }: { entries: TDevelopment[] }) => {
  const [isLoading, setIsLoading] = useState(false);

  const onAction = async (
    action: 'GET_NEW_ENTRIES' | 'PROCESS_WITH_GPT' | 'ADD_TO_SHEET'
  ) => {
    setIsLoading(true);
    try {
      let result: { error?: string; message?: string } = {
        error: '',
        message: '',
      };

      if (action === 'GET_NEW_ENTRIES') {
        result = await getNewEntries();
      } else if (action === 'PROCESS_WITH_GPT') {
        result = await processWithGPT();
      } else if (action === 'ADD_TO_SHEET') {
        result = await addToSheet();
      }

      const { error, message } = result;

      if (error) {
        toast({
          icon: 'error',
          description: error,
        });
      } else {
        toast({
          icon: 'success',
          description: message,
        });
      }
    } catch (error) {
      toast({
        icon: 'error',
        description: 'Something went wrong :(',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openURL = (url: string | null) => {
    if (!url) return;
    window.open(url, '_blank');
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-1 mb-4">
        <Button
          onClick={() => onAction('GET_NEW_ENTRIES')}
          disabled={isLoading}
        >
          get 💩
        </Button>
        <Button
          onClick={() => onAction('PROCESS_WITH_GPT')}
          disabled={isLoading}
        >
          use 🤖
        </Button>
        <Button onClick={() => onAction('ADD_TO_SHEET')} disabled={isLoading}>
          Add to sheet 📝
        </Button>
        {isLoading ? (
          <>
            <Button
              className="hover:cursor-progress"
              variant={'ghost'}
              disabled={true}
            >
              <div className="animate-spin">
                <Disc3Icon className="w-5 h-5" />
              </div>
            </Button>
            <link
              rel="icon shortcut"
              href="/mushroom_loading.gif"
              type="image/gif"
            />
          </>
        ) : (
          <link rel="icon shortcut" href="/mushroom.ico" type="image/x-icon" />
        )}
      </div>

      {entries.length > 0 && (
        <div className="bg-muted p-0.5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name of Development</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Rental/Condo</TableHead>
                <TableHead>Developer</TableHead>
                <TableHead>Number of Units</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Published Date</TableHead>
                <TableHead>Words</TableHead>
                <TableHead>GPT cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow
                  key={entry.entry_id}
                  className={`${getStatusColor(entry)}`}
                  onClick={() => openURL(entry.link)}
                >
                  <TableCell>{entry.name_of_development}</TableCell>
                  <TableCell>{entry.location}</TableCell>
                  <TableCell>{entry.rental_condo}</TableCell>
                  <TableCell>{entry.developer}</TableCell>
                  <TableCell>{entry.number_of_units}</TableCell>
                  <TableCell>{entry.status}</TableCell>
                  <TableCell>
                    {entry.published_date
                      ? format(
                          parseISO(entry.published_date),
                          'MMMM d, yyyy h:mm a'
                        )
                      : 'N/A'}
                  </TableCell>
                  <TableCell>{entry.words}</TableCell>
                  <TableCell>${entry.gpt_cost?.toFixed(7)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
