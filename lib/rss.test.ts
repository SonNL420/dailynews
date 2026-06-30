import { describe, it, expect } from 'vitest';
import {
  buildSummary,
  extractImage,
  normalizeItem,
  parseFeedXml,
  parsePublishedAt,
  type RawFeedItem,
} from './rss';
import type { Source } from './types';

const SOURCE: Source = {
  id: 'test',
  name: 'Test Feed',
  url: 'https://example.com/rss.xml',
  language: 'en',
  country: 'GB',
  category: 'world',
};

const SAMPLE = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Test Feed</title>
    <item>
      <title>Markets rise &amp; fall</title>
      <link>https://example.com/a</link>
      <pubDate>Wed, 01 Jan 2025 10:00:00 GMT</pubDate>
      <description><![CDATA[<p>Some <b>long enough</b> summary text for the article body.</p>]]></description>
      <media:content url="https://img.example.com/a.jpg" medium="image" />
    </item>
    <item>
      <title>Body image only</title>
      <link>https://example.com/b</link>
      <pubDate>Wed, 01 Jan 2025 09:00:00 GMT</pubDate>
      <content:encoded><![CDATA[<p>Text with <img src="https://img.example.com/b.png" /> inside.</p>]]></content:encoded>
    </item>
    <item>
      <title>Enclosure image</title>
      <link>https://example.com/c</link>
      <enclosure url="https://img.example.com/c.jpg" type="image/jpeg" length="1000" />
    </item>
    <item>
      <title>No link should be dropped</title>
    </item>
  </channel>
</rss>`;

describe('parseFeedXml', () => {
  it('drops items without a link and keeps the rest', async () => {
    const articles = await parseFeedXml(SAMPLE, SOURCE);
    expect(articles).toHaveLength(3);
    expect(articles.map((a) => a.link)).toEqual([
      'https://example.com/a',
      'https://example.com/b',
      'https://example.com/c',
    ]);
  });

  it('decodes entities in titles and carries source metadata', async () => {
    const [first] = await parseFeedXml(SAMPLE, SOURCE);
    expect(first.title).toBe('Markets rise & fall');
    expect(first.sourceName).toBe('Test Feed');
    expect(first.language).toBe('en');
    expect(first.country).toBe('GB');
    expect(first.category).toBe('world');
    expect(first.id).toMatch(/^[0-9a-f]{16}$/);
  });
});

describe('extractImage', () => {
  it('reads media:content images', () => {
    const item: RawFeedItem = {
      mediaContent: [{ $: { url: 'https://img/x.jpg', medium: 'image' } }],
    };
    expect(extractImage(item)).toBe('https://img/x.jpg');
  });

  it('falls back to the first <img> in the body', () => {
    const item: RawFeedItem = {
      contentEncoded: '<p>hi <img src="https://img/y.png"></p>',
    };
    expect(extractImage(item)).toBe('https://img/y.png');
  });

  it('uses an image enclosure', () => {
    const item: RawFeedItem = {
      enclosure: { url: 'https://img/z.jpg', type: 'image/jpeg' },
    };
    expect(extractImage(item)).toBe('https://img/z.jpg');
  });

  it('returns undefined when there is no image', () => {
    expect(extractImage({ title: 'x' })).toBeUndefined();
  });
});

describe('buildSummary', () => {
  it('strips html and collapses whitespace', () => {
    const item: RawFeedItem = { content: '<p>Hello   <b>world</b>\n\nagain</p>' };
    expect(buildSummary(item)).toBe('Hello world again');
  });

  it('truncates very long text with an ellipsis', () => {
    const item: RawFeedItem = { content: 'word '.repeat(200) };
    const summary = buildSummary(item);
    expect(summary.length).toBeLessThanOrEqual(241);
    expect(summary.endsWith('…')).toBe(true);
  });
});

describe('parsePublishedAt', () => {
  it('parses a valid pubDate to ISO', () => {
    const iso = parsePublishedAt({ pubDate: 'Wed, 01 Jan 2025 10:00:00 GMT' });
    expect(iso).toBe('2025-01-01T10:00:00.000Z');
  });

  it('falls back to now when the date is missing/invalid', () => {
    const iso = parsePublishedAt({ pubDate: 'not a date' }, () => 1700000000000);
    expect(iso).toBe(new Date(1700000000000).toISOString());
  });
});

describe('normalizeItem', () => {
  it('returns null when essentials are missing', () => {
    expect(normalizeItem({ title: 'only title' }, SOURCE)).toBeNull();
    expect(normalizeItem({ link: 'https://x/y' }, SOURCE)).toBeNull();
  });
});
