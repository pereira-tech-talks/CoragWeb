import type { APIRoute } from 'astro';

import { SITE_URL } from '@/lib/constances';
import {
  formatEcosystemAppMarkdown,
  loadEcosystemDirectory,
} from '@/lib/ecosystem';
import { ECOSYSTEM_CATEGORIES } from '@/lib/ecosystem-apps';
import { serializeGenericToMarkdown } from '@/lib/markdown-for-agents';
import { getTranslations } from '@/lib/translations';

export const GET: APIRoute = async () => {
  const lang = 'en';
  const t = getTranslations(lang).ecosystemPage;
  const { featured, groups } = await loadEcosystemDirectory();
  const developersUrlBase = `${SITE_URL}/en`;
  const mdLabels = {
    whatLabel: t.whatLabel,
    howLabel: t.howLabel,
    overview: t.overview,
    features: t.features,
    tools: t.tools,
    audience: t.audience,
    coverage: t.coverage,
    limits: t.limits,
    integrations: t.integrations,
    publicApi: t.publicApi,
    publicMcp: t.publicMcp,
    availabilityYes: t.availabilityYes,
    availabilityNo: t.availabilityNo,
    availabilityUnknown: t.availabilityUnknown,
    apiDocs: t.apiDocs,
    openApi: t.openApi,
    mcpEndpoint: t.mcpEndpoint,
    developers: t.developers,
  };

  const sections = [
    {
      heading: t.featuredEyebrow,
      lines: featured
        ? [
            formatEcosystemAppMarkdown(
              featured,
              lang,
              mdLabels,
              developersUrlBase
            ),
          ]
        : [],
    },
    {
      heading: t.directoryTitle,
      lines: [t.directoryLead],
    },
    ...ECOSYSTEM_CATEGORIES.map((category) => ({
      heading: t.categories[category],
      lines: [
        t.categoryLeads[category],
        ...groups[category].map((app) =>
          formatEcosystemAppMarkdown(app, lang, mdLabels, developersUrlBase)
        ),
      ],
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
    canonical: `${SITE_URL}/en/ecosystem`,
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
