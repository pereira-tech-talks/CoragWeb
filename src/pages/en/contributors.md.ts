import type { APIRoute } from 'astro';

import { SITE_URL } from '@/lib/constances';
import {
  filterCurrentTeamOrganizers,
  filterPastTeamMembers,
  getContributors,
} from '@/lib/contributor';
import {
  entityLine,
  resolveI18n,
  serializeGenericToMarkdown,
} from '@/lib/markdown-for-agents';

export const GET: APIRoute = async () => {
  const lang = 'en';
  const contributors = await getContributors();
  const current = filterCurrentTeamOrganizers(contributors);
  const past = filterPastTeamMembers(contributors);

  // The HTML renders each person's bio, not just their role. A name-and-role
  // list read as a summary of the directory rather than its twin.
  const toLines = (list: typeof contributors): string[] =>
    list.flatMap((c) => {
      const bio = resolveI18n(c.data.bio, lang);
      const row = entityLine(
        c.data.name,
        `/en/contributors`,
        resolveI18n(c.data.role, lang)
      );
      return bio ? [row, `  ${bio}`] : [row];
    });

  // The HTML shows an empty state rather than hiding the section, so the twin
  // must say the same thing. Dropping the heading would report the directory as
  // absent when the page reports it as not yet published.
  const orEmpty = (lines: string[]): string[] =>
    lines.length > 0
      ? lines
      : ['No contributors published in this section yet.'];

  const markdown = serializeGenericToMarkdown({
    title: 'Contributors — Corag',
    description:
      'The people building Corag, by area, plus those who contributed before. Directory at /en/contributors.',
    lang,
    canonical: `${SITE_URL}/en/contributors`,
    metadata: [
      ['Active contributors', String(current.length)],
      ['Past contributors', String(past.length)],
      ['Total in directory', String(contributors.length)],
    ],
    body: 'Corag is built by a team donating their time: engineering, design, content, field coordination and partnerships. Anyone who stops being active is not deleted: time someone donated does not stop counting.',
    sections: [
      { heading: 'Active team', lines: orEmpty(toLines(current)) },
      { heading: 'Past contributors', lines: orEmpty(toLines(past)) },
    ],
  });

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': 'inline',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
