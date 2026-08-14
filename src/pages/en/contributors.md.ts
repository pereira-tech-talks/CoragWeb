import type { APIRoute } from 'astro';

import { getAlliesByKind } from '@/lib/ally';
import { SITE_URL } from '@/lib/constances';
import {
  filterCurrentTeamOrganizers,
  filterPublishedCollaborators,
  getContributors,
} from '@/lib/contributor';
import {
  appInviteSection,
  entityLine,
  resolveI18n,
  serializeGenericToMarkdown,
} from '@/lib/markdown-for-agents';

export const GET: APIRoute = async () => {
  const lang = 'en';
  const contributors = await getContributors();
  const team = filterCurrentTeamOrganizers(contributors);
  const collaborators = filterPublishedCollaborators(contributors);
  const communities = await getAlliesByKind('community');
  const companies = await getAlliesByKind('company');
  const peopleCount = team.length + collaborators.length;

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
    lines.length > 0 ? lines : ['No people published in this section yet.'];

  const sections = [
    {
      heading: 'Internal team',
      lines: orEmpty(toLines(team)),
    },
    ...(collaborators.length > 0
      ? [
          {
            heading: 'Contributors',
            lines: toLines(collaborators),
          },
        ]
      : []),
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
      ['Internal team', String(team.length)],
      ['Contributors', String(collaborators.length)],
      ['Allied communities', String(communities.length)],
      ['Allied companies', String(companies.length)],
    ],
    body: [
      'Who we are.',
      `Corag is built by ${peopleCount} people donating their time. These are they.`,
      'First the internal team; then people who contribute without being the operating core.',
      'Allied communities and companies also add capacity, reach or infrastructure to the network.',
    ].join(' '),
    sections: [...sections, appInviteSection(lang)],
  });

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': 'inline',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
