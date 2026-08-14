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
    {
      heading: 'Active team',
      lines: ['Building it today.', ...orEmpty(toLines(current))],
    },
    ...(communities.length > 0
      ? [{ heading: 'Allied communities', lines: allyLines(communities) }]
      : []),
    ...(companies.length > 0
      ? [{ heading: 'Allied companies', lines: allyLines(companies) }]
      : []),
    {
      heading: 'How to join',
      lines: [
        'I want to contribute: write through the contact form.',
        'How to contribute: open guide at /en/contributing.',
      ],
    },
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
    body: [
      'Who we are.',
      `Corag is built by ${current.length} people donating their time. These are they.`,
      'Everyone contributes from their own area. The work is voluntary and the credit is shared.',
      'Allied communities and companies also add capacity, reach or infrastructure to the network.',
    ].join(' '),
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
