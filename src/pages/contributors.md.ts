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
  const lang = 'es';
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
        `/contributors`,
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
      : ['Aún no hay colaboradores publicados en esta sección.'];

  const markdown = serializeGenericToMarkdown({
    title: 'Colaboradores — Corag',
    description:
      'Las personas que construyen Corag, por área, y quienes colaboraron antes. Directorio en /contributors.',
    lang,
    canonical: `${SITE_URL}/contributors`,
    metadata: [
      ['Colaboradores activos', String(current.length)],
      ['Colaboradores anteriores', String(past.length)],
      ['Total en directorio', String(contributors.length)],
    ],
    body: 'Corag lo construye un equipo que dona su tiempo: desarrollo, diseño, contenido, coordinación en terreno y alianzas. Quien dejó de estar activo no se borra: el tiempo que alguien donó no deja de contar.',
    sections: [
      { heading: 'Equipo activo', lines: orEmpty(toLines(current)) },
      {
        heading: 'Colaboradores anteriores',
        lines: orEmpty(toLines(past)),
      },
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
