import { FeedEntry } from '@extractus/feed-extractor';
import { extractEntryId } from './extractEntryId';
import { initMappedDevelopmentInfo } from './initMappedDevelopmentInfo';

export const getMappedNewEntries = async (
  existingIdsInDb: number[],
  rssEntries: FeedEntry[]
) => {
  const rssDataEntryIds = rssEntries.map((entry) => extractEntryId(entry.id));

  const newEntryIds = rssDataEntryIds.filter(
    (id) => !existingIdsInDb.includes(id)
  );

  const newEntries = rssEntries.filter((entry) =>
    newEntryIds.includes(extractEntryId(entry.id))
  );

  if (newEntries.length === 0) return [];

  const newEntryPromises = newEntries.map((entry) =>
    initMappedDevelopmentInfo(entry)
  );

  const mappedEntries = await Promise.all(newEntryPromises);

  return mappedEntries;
};
