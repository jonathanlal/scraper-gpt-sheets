import { FeedEntry } from '@extractus/feed-extractor';
import { getArticleContent } from './getArticleContent';
import { extractEntryId } from './extractEntryId';

export async function initMappedDevelopmentInfo(entry: FeedEntry) {
  const description = entry.description;
  const entryLink = entry.link;

  const articleContent = entryLink ? await getArticleContent(entryLink) : null;
  const wordCount = articleContent ? articleContent.split(/\s+/).length : 0;

  return {
    title: entry.title || 'N/A',
    entry_id: extractEntryId(entry.id),
    name_of_development: 'N/A',
    location: 'N/A',
    rental_condo: 'N/A',
    developer: 'N/A',
    number_of_units: 'N/A',
    status: 'N/A',
    published_date: entry.published,
    description: description,
    article_content: articleContent,
    link: entryLink,
    words: wordCount,
  };
}
