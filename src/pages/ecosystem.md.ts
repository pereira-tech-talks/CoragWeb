import type { APIRoute } from 'astro';

import { SITE_URL } from '@/lib/constances';
import { loadEcosystemDirectory } from '@/lib/ecosystem';
import { ECOSYSTEM_CATEGORIES } from '@/lib/ecosystem-apps';
import { serializeGenericToMarkdown } from '@/lib/markdown-for-agents';
import { getTranslations } from '@/lib/translations';

export const GET: APIRoute = async () => {
  const lang = 'es';
  const t = getTranslations(lang).ecosystemPage;
  const { featured, groups } = await loadEcosystemDirectory();

  const sections = [
    {
      heading: t.featuredEyebrow,
      lines: featured
        ? [
            `- **${featured.data.name}** — ${featured.data.url}`,
            `  - ${featured.data.what[lang]}`,
            `  - ${featured.data.how[lang]}`,
          ]
        : [],
    },
    ...ECOSYSTEM_CATEGORIES.map((category) => ({
      heading: t.categories[category],
      lines: groups[category].map((app) => {
        const api = app.data.apiDocsUrl ? ` · API: ${app.data.apiDocsUrl}` : '';
        return [
          `- **${app.data.name}** — ${app.data.url}${api}`,
          `  - ${t.whatLabel} ${app.data.what[lang]}`,
          `  - ${t.howLabel} ${app.data.how[lang]}`,
        ].join('\n');
      }),
    })),
    {
      heading: t.joinTitle,
      lines: [t.joinLead, t.disclosure],
    },
  ];

  const markdown = serializeGenericToMarkdown({
    title: `${t.title} — Corag`,
    description: t.description,
    lang,
    canonical: `${SITE_URL}/ecosystem`,
    body: `${t.headline}\n\n${t.lead}`,
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
