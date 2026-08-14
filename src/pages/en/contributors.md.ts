import type { APIRoute } from 'astro';

import { getAlliesByKind } from '@/lib/ally';
import { SITE_URL } from '@/lib/constances';
import {
  filterCurrentTeamOrganizers,
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
  const communities = await getAlliesByKind('community');
  const companies = await getAlliesByKind('company');

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

  const allyLines = (
    list: Awaited<ReturnType<typeof getAlliesByKind>>
  ): string[] =>
    list.flatMap((a) => {
      const bio = resolveI18n(a.data.bio, lang);
      const row = entityLine(
        a.data.name,
        a.data.url ?? `/en/contributors`,
        resolveI18n(a.data.role, lang)
      );
      return bio ? [row, `  ${bio}`] : [row];
    });

  const orEmpty = (lines: string[]): string[] =>
    lines.length > 0
      ? lines
      : ['No contributors published in this section yet.'];

  const sections = [
    { heading: 'Active team', lines: orEmpty(toLines(current)) },
    ...(communities.length > 0
      ? [{ heading: 'Allied communities', lines: allyLines(communities) }]
      : []),
    ...(companies.length > 0
      ? [{ heading: 'Allied companies', lines: allyLines(companies) }]
      : []),
  ];

  const markdown = serializeGenericToMarkdown({
    title: 'Team & contributors — Corag',
    description:
      'The people building Corag, by area, allied communities and allied companies. Directory at /en/contributors.',
    lang,
    canonical: `${SITE_URL}/en/contributors`,
    metadata: [
      ['Active contributors', String(current.length)],
      ['Allied communities', String(communities.length)],
      ['Allied companies', String(companies.length)],
      ['Total in directory', String(contributors.length)],
    ],
    body: 'Corag is built by a team donating their time: engineering, design, content, field coordination and partnerships. Allied communities and companies add capacity to the network.',
    sections,
  });

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': 'inline',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
