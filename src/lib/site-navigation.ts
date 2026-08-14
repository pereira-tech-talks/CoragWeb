/**
 * The site's navigation surface, in one place.
 *
 * Before this module the structure existed three times — `Header.svelte` /
 * `MobileMenu.svelte`, `Footer.astro`, and a hand-maintained copy inside
 * `markdown-for-agents.ts` — and they had drifted apart. One source now.
 *
 * ⚠️ Every path here must resolve to a page that exists. The Corag routes
 * (`/como-funciona`, `/transparencia`, `/emergencias`, `/lideres`,
 * `/desarrolladores`, `/aliados`) are added as their pages land, together with
 * their `src/middleware.ts` allowlist entries.
 *
 * The footer and the agent-Markdown Site Navigation block are both derived from
 * here. The Svelte chrome keeps its own markup (see the Task 8 log) but its
 * paths are asserted against this module by
 * `tests/unit/lib/site-navigation.test.ts`, so an enforced copy cannot drift
 * silently.
 *
 * Part of PLAN_sitewide_language_seo_aeo_audit Task 8.
 */
import { APP_URL } from '@/lib/constances';
import { DEFAULT_LANGUAGE, getUrlPrefix, isValidLanguage } from '@/lib/i18n';

export interface NavEntry {
  label: Record<string, string>;
  /** Site-root-relative path, or an absolute URL when `external`. */
  path: string;
  external?: boolean;
  /**
   * True when the live header or mobile menu exposes this entry. The chrome
   * test asserts this set matches the components exactly.
   */
  inChrome?: boolean;
}

export interface NavGroup {
  title: Record<string, string>;
  entries: NavEntry[];
}

export const SITE_NAVIGATION: NavGroup[] = [
  {
    title: { en: 'Main', es: 'Principal' },
    entries: [
      { label: { en: 'Home', es: 'Inicio' }, path: '/', inChrome: true },
      {
        label: { en: 'About', es: 'Sobre Corag' },
        path: '/about',
        inChrome: true,
      },
      {
        label: { en: 'Contact', es: 'Contacto' },
        path: '/contact',
        inChrome: true,
      },
    ],
  },
  {
    title: { en: 'Community', es: 'Comunidad' },
    entries: [
      {
        label: { en: 'Contributors', es: 'Colaboradores' },
        path: '/contributors',
        inChrome: true,
      },
      {
        label: { en: 'Channels', es: 'Canales' },
        path: '/channels',
        inChrome: true,
      },
      {
        label: { en: 'Contributing', es: 'Cómo contribuir' },
        path: '/contributing',
      },
      { label: { en: 'Governance', es: 'Gobernanza' }, path: '/governance' },
      {
        label: { en: 'Code of Conduct', es: 'Código de Conducta' },
        path: '/conduct',
      },
    ],
  },
  {
    title: { en: 'Content', es: 'Contenido' },
    entries: [
      { label: { en: 'Blog', es: 'Blog' }, path: '/blog', inChrome: true },
      {
        label: { en: 'Blog series', es: 'Series del blog' },
        path: '/blog/series',
      },
    ],
  },
  {
    title: { en: 'Ayuda Directa', es: 'Ayuda Directa' },
    entries: [
      {
        /*
         * The application. Every transactional action lives there, so this is
         * the most important outbound link on the site — it belongs in the
         * navigation, not only in page CTAs.
         */
        label: { en: 'Go to the app', es: 'Ir a la aplicación' },
        path: APP_URL,
        external: true,
        inChrome: true,
      },
    ],
  },
];

/** Every internal path the navigation exposes, without a language prefix. */
export const internalNavPaths = (): string[] =>
  SITE_NAVIGATION.flatMap((group) =>
    group.entries.filter((e) => !e.external).map((e) => e.path)
  );

/** The subset the live header and mobile menu expose. */
export const chromeNavPaths = (): string[] =>
  SITE_NAVIGATION.flatMap((group) =>
    group.entries.filter((e) => e.inChrome).map((e) => e.path)
  );

const prefixFor = (lang: string): string =>
  getUrlPrefix(isValidLanguage(lang) ? lang : DEFAULT_LANGUAGE);

/** A nav entry's href in a given language. Root stays `/` when unprefixed. */
export const navHref = (entry: NavEntry, lang: string): string => {
  if (entry.external) return entry.path;
  const prefix = prefixFor(lang);
  if (entry.path === '/') return prefix || '/';
  return `${prefix}${entry.path}`;
};

/** A nav entry's label in a given language, falling back to English. */
export const navLabel = (entry: NavEntry, lang: string): string =>
  entry.label[lang] ?? entry.label.en;

/** Resolved `{ label, href }` pairs for a group, by group title (English). */
export const navGroup = (
  titleEn: string,
  lang: string
): Array<{ label: string; href: string }> => {
  const group = SITE_NAVIGATION.find((g) => g.title.en === titleEn);
  if (!group) return [];
  return group.entries.map((entry) => ({
    label: navLabel(entry, lang),
    href: navHref(entry, lang),
  }));
};
