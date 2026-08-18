/**
 * Builder for the public `/api/ecosystem.json` payload — the machine-readable
 * twin of the `/ecosystem` directory, meant for other apps and agents.
 *
 * Kept free of `astro:content` so unit tests can feed plain fixtures; the
 * endpoint maps collection entries into `EcosystemApiSourceEntry` first.
 * Every text field ships both languages, so one canonical URL serves both.
 */
import { SITE_URL } from '@/lib/constances';
import {
  ECOSYSTEM_CATEGORIES,
  type EcosystemCategory,
  filterActiveEcosystemApps,
  sortEcosystemApps,
} from '@/lib/ecosystem-apps';
import { formatEcosystemDisplayUrl } from '@/lib/ecosystem-view';
import { getTranslations } from '@/lib/translations';

export const ECOSYSTEM_API_PATH = '/api/ecosystem.json';

export interface EcosystemApiText {
  es: string;
  en: string;
}

export type EcosystemApiAvailability = 'yes' | 'no' | 'unknown';

/** Structural mirror of the `ecosystemApps` collection entry. */
export interface EcosystemApiSourceEntry {
  id: string;
  data: {
    name: string;
    url: string;
    category: EcosystemCategory;
    featured?: boolean;
    order?: number;
    active?: boolean;
    logo?: string;
    logoAuthorization?: string;
    tagline: EcosystemApiText;
    what: EcosystemApiText;
    how: EcosystemApiText;
    overview?: EcosystemApiText;
    features?: EcosystemApiText[];
    tools?: EcosystemApiText[];
    audience?: EcosystemApiText;
    coverage?: EcosystemApiText;
    limits?: EcosystemApiText;
    integrations?: {
      publicApi?: EcosystemApiAvailability;
      publicMcp?: EcosystemApiAvailability;
      apiDocsUrl?: string;
      openApiUrl?: string;
      mcpUrl?: string;
      developersUrl?: string;
      notes?: EcosystemApiText;
    };
    apiDocsUrl?: string;
  };
}

export interface EcosystemApiApp {
  id: string;
  name: string;
  url: string;
  displayUrl: string;
  category: EcosystemCategory;
  featured: boolean;
  /** Absolute URL, present only when the owner authorized the logo. */
  logo?: string;
  tagline: EcosystemApiText;
  what: EcosystemApiText;
  how: EcosystemApiText;
  overview: EcosystemApiText;
  features: EcosystemApiText[];
  tools: EcosystemApiText[];
  audience?: EcosystemApiText;
  coverage?: EcosystemApiText;
  limits?: EcosystemApiText;
  integrations: {
    publicApi: EcosystemApiAvailability;
    publicMcp: EcosystemApiAvailability;
    apiDocsUrl?: string;
    openApiUrl?: string;
    mcpUrl?: string;
    developersUrl?: string;
    notes?: EcosystemApiText;
  };
}

export interface EcosystemApiCategory {
  id: EcosystemCategory;
  label: EcosystemApiText;
  lead: EcosystemApiText;
  count: number;
}

export interface EcosystemApiPayload {
  version: 1;
  name: string;
  description: EcosystemApiText;
  site: string;
  endpoint: string;
  page: EcosystemApiText;
  markdownTwins: EcosystemApiText;
  /** The same non-endorsement note the directory page carries. */
  disclosure: EcosystemApiText;
  generatedAt: string;
  counts: { apps: number; byCategory: Record<EcosystemCategory, number> };
  categories: EcosystemApiCategory[];
  apps: EcosystemApiApp[];
}

/** Site-relative URLs (like `/developers`) become absolute; the rest pass through. */
function absoluteUrl(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  return raw.startsWith('/') ? `${SITE_URL}${raw}` : raw;
}

function toApiApp(entry: EcosystemApiSourceEntry): EcosystemApiApp {
  const d = entry.data;
  const integrations = d.integrations ?? {};
  const app: EcosystemApiApp = {
    id: entry.id,
    name: d.name,
    url: d.url,
    displayUrl: formatEcosystemDisplayUrl(d.url),
    category: d.category,
    featured: d.featured === true,
    tagline: d.tagline,
    what: d.what,
    how: d.how,
    overview: d.overview ?? d.what,
    features: d.features ?? [],
    tools: d.tools ?? [],
    integrations: {
      publicApi: integrations.publicApi ?? 'unknown',
      publicMcp: integrations.publicMcp ?? 'unknown',
      apiDocsUrl: integrations.apiDocsUrl ?? d.apiDocsUrl,
      openApiUrl: integrations.openApiUrl,
      mcpUrl: integrations.mcpUrl,
      developersUrl: absoluteUrl(integrations.developersUrl),
      notes: integrations.notes,
    },
  };
  if (d.audience) app.audience = d.audience;
  if (d.coverage) app.coverage = d.coverage;
  if (d.limits) app.limits = d.limits;
  if (d.logo && d.logoAuthorization === 'authorized') {
    app.logo = absoluteUrl(d.logo);
  }
  return app;
}

export function buildEcosystemApiPayload(
  entries: EcosystemApiSourceEntry[],
  generatedAt: string
): EcosystemApiPayload {
  const es = getTranslations('es').ecosystemPage;
  const en = getTranslations('en').ecosystemPage;

  const byName = new Map(entries.map((e) => [e.data.name, e]));
  const sorted = sortEcosystemApps(
    filterActiveEcosystemApps(
      entries.map((e) => ({
        name: e.data.name,
        url: e.data.url,
        category: e.data.category,
        featured: e.data.featured,
        order: e.data.order,
        active: e.data.active,
      }))
    )
  );
  const apps = sorted.map((m) => {
    const entry = byName.get(m.name);
    if (!entry) throw new Error(`Ecosystem entry lost in sort: ${m.name}`);
    return toApiApp(entry);
  });

  const byCategory = Object.fromEntries(
    ECOSYSTEM_CATEGORIES.map((c) => [
      c,
      apps.filter((a) => a.category === c).length,
    ])
  ) as Record<EcosystemCategory, number>;

  return {
    version: 1,
    name: 'Corag ecosystem directory',
    description: { es: es.description, en: en.description },
    site: SITE_URL,
    endpoint: `${SITE_URL}${ECOSYSTEM_API_PATH}`,
    page: { es: `${SITE_URL}/ecosystem`, en: `${SITE_URL}/en/ecosystem` },
    markdownTwins: {
      es: `${SITE_URL}/ecosystem.md`,
      en: `${SITE_URL}/en/ecosystem.md`,
    },
    disclosure: { es: es.disclosure, en: en.disclosure },
    generatedAt,
    counts: { apps: apps.length, byCategory },
    categories: ECOSYSTEM_CATEGORIES.map((c) => ({
      id: c,
      label: { es: es.categories[c], en: en.categories[c] },
      lead: { es: es.categoryLeads[c], en: en.categoryLeads[c] },
      count: byCategory[c],
    })),
    apps,
  };
}
