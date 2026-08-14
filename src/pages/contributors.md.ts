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
  const lang = 'es';
  const contributors = await getContributors();
  const current = filterCurrentTeamOrganizers(contributors);
  const communities = await getAlliesByKind('community');
  const companies = await getAlliesByKind('company');

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
      : ['Aún no hay colaboradores publicados en esta sección.'];

  const sections = [
    { heading: 'Equipo activo', lines: orEmpty(toLines(current)) },
    ...(communities.length > 0
      ? [{ heading: 'Comunidades aliadas', lines: allyLines(communities) }]
      : []),
    ...(companies.length > 0
      ? [{ heading: 'Empresas aliadas', lines: allyLines(companies) }]
      : []),
  ];

  const markdown = serializeGenericToMarkdown({
    title: 'Equipo y colaboradores — Corag',
    description:
      'Las personas que construyen Corag, por área, las comunidades aliadas y las empresas aliadas. Directorio en /contributors.',
    lang,
    canonical: `${SITE_URL}/contributors`,
    metadata: [
      ['Colaboradores activos', String(current.length)],
      ['Comunidades aliadas', String(communities.length)],
      ['Empresas aliadas', String(companies.length)],
      ['Total en directorio', String(contributors.length)],
    ],
    body: 'Corag lo construye un equipo que dona su tiempo: desarrollo, diseño, contenido, coordinación en terreno y alianzas. También comunidades y empresas que suman capacidad a la red.',
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
