import type { APIRoute } from 'astro';

import { getAlliesByKind } from '@/lib/ally';
import { SITE_URL } from '@/lib/constances';
import {
  filterCurrentTeamOrganizers,
  filterPublishedCollaborators,
  getContributors,
} from '@/lib/contributor';
import {
  entityLine,
  resolveI18n,
  serializeGenericToMarkdown,
} from '@/lib/markdown-for-agents';

export const GET: APIRoute = async () => {
  const lang = 'es';
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
        `/contributors`,
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
        a.data.url ?? `/contributors`,
        resolveI18n(a.data.role, lang)
      );
      return bio ? [row, `  ${bio}`] : [row];
    });

  const orEmpty = (lines: string[]): string[] =>
    lines.length > 0
      ? lines
      : ['Aún no hay personas publicadas en esta sección.'];

  const sections = [
    {
      heading: 'Equipo interno',
      lines: orEmpty(toLines(team)),
    },
    ...(collaborators.length > 0
      ? [
          {
            heading: 'Colaboradores',
            lines: toLines(collaborators),
          },
        ]
      : []),
    ...(communities.length > 0
      ? [{ heading: 'Comunidades aliadas', lines: allyLines(communities) }]
      : []),
    ...(companies.length > 0
      ? [{ heading: 'Empresas aliadas', lines: allyLines(companies) }]
      : []),
    {
      heading: 'Cómo sumarte',
      lines: [
        'Quiero colaborar: escribe por el formulario de contacto.',
        'Cómo contribuir: guía abierta en /contributing.',
      ],
    },
  ];

  const markdown = serializeGenericToMarkdown({
    title: 'Equipo y colaboradores — Corag',
    description:
      'Las personas que construyen Corag, por área, las comunidades aliadas y las empresas aliadas. Directorio en /contributors.',
    lang,
    canonical: `${SITE_URL}/contributors`,
    metadata: [
      ['Equipo interno', String(team.length)],
      ['Colaboradores', String(collaborators.length)],
      ['Comunidades aliadas', String(communities.length)],
      ['Empresas aliadas', String(companies.length)],
    ],
    body: [
      'Quiénes somos.',
      `Corag lo construyen ${peopleCount} personas que donan su tiempo. Estas son.`,
      'Primero el equipo interno; después quienes colaboran sin ser el núcleo operativo.',
      'También comunidades y empresas que suman capacidad, difusión o infraestructura a la red.',
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
