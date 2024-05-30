import { JSDOM } from 'jsdom';

export async function getArticleContent(url: string) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const dom = new JSDOM(html);
    const contentElement = dom.window.document.querySelector('.entry-content');
    return contentElement && contentElement.textContent
      ? contentElement.textContent.trim()
      : null;
  } catch (error) {
    return null;
  }
}
