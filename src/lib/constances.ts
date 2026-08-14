/** Timezone for scheduled post detection — build and badge use this consistently */
export const SITE_TIMEZONE = 'America/Bogota';
/** Fixed offset for Colombia wall-clock times (UTC−5, no DST). */
export const SITE_TIMEZONE_OFFSET = '-05:00';

/**
 * Public site origin (no trailing slash).
 * Must match `astro.config.mjs` → `site` / `PUBLIC_SITE_URL`.
 */
export const SITE_URL: string = (
  import.meta.env.SITE || 'https://corag.org'
).replace(/\/$/, '');

/**
 * The Ayuda Directa application. Every transactional action — publicar una
 * necesidad, ofrecer ayuda, aportar, seguir un aporte, postularse como líder —
 * happens there, not here. Defined once so no component hardcodes the host.
 */
export const APP_URL: string = (
  import.meta.env.PUBLIC_APP_URL || 'https://app.corag.org'
).replace(/\/$/, '');

/** Build a link into the application. */
export function appUrl(path = '/'): string {
  return `${APP_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export const SITE_TITLE: string = 'Corag — El ecosistema de impacto social';
export const SITE_DESCRIPTION: string =
  'Conectamos a quienes quieren ayudar con quienes más lo necesitan. Corag une gobiernos, organizaciones y personas para que la ayuda sea transparente, medible y constante.';

/** Legal entity behind the project. */
export const ORGANIZATION_NAME = 'Corag';

/**
 * Public contact address.
 *
 * Deliberately empty until a real mailbox is confirmed — an invented address
 * silently drops messages from people asking for help. While empty, every
 * consumer must fall back to the contact form at `/contacto`.
 */
export const CONTACT_EMAIL = '';

/**
 * Official social accounts, for the footer and the Organization JSON-LD
 * `sameAs`. Only add an entry once the account is confirmed to exist —
 * a fabricated `sameAs` is a structured-data error, not a placeholder.
 */
export const SOCIAL_LINKS: { label: string; href: string }[] = [];
export const BLOG_PAGE_SIZE: number = 30;

/** Default Open Graph / Twitter share image (1200×630), by language. */
export const DEFAULT_OG_IMAGE_ES = '/images/og-default.jpg';
export const DEFAULT_OG_IMAGE_EN = '/images/og-default-en.jpg';

export function getDefaultOgImage(lang: string | undefined): string {
  return lang === 'en' ? DEFAULT_OG_IMAGE_EN : DEFAULT_OG_IMAGE_ES;
}

const umamiWebsiteId = (import.meta.env.PUBLIC_UMAMI_WEBSITE_ID || '').trim();
const umamiScriptOverride = (
  import.meta.env.PUBLIC_UMAMI_SCRIPT_URL || ''
).trim();
const umamiUseProxy = import.meta.env.PUBLIC_UMAMI_USE_PROXY !== 'false';

// Analytics configuration — scripts load only when IDs are provided
export const ANALYTICS = {
  umami: {
    websiteId: umamiWebsiteId,
    /** Load tracker in production when website ID is set; opt-in locally via PUBLIC_UMAMI_ENABLE=true */
    enabled:
      Boolean(umamiWebsiteId) &&
      (import.meta.env.PROD || import.meta.env.PUBLIC_UMAMI_ENABLE === 'true'),
    scriptUrl:
      umamiScriptOverride ||
      (umamiUseProxy
        ? '/api/umami/script.js'
        : 'https://cloud.umami.is/script.js'),
    /** Same-origin collect endpoint when first-party proxy is enabled */
    hostUrl: umamiUseProxy ? '/api/umami' : '',
  },
  verification: {
    bing: import.meta.env.PUBLIC_BING_SITE_VERIFICATION || '',
  },
} as const;

/**
 * Newsletter signup — currently disabled in UI (BlogPostPage).
 * No Google Forms backend. Re-enable only with a Dailybot (or other) API path.
 */
export const NEWSLETTER = {
  apiEndpoint: '',
} as const;

/**
 * Community intake forms → Cloudflare Pages Function → Dailybot Forms.
 *
 * Default endpoint is `/api/contact` so production never silently falls back
 * to a third-party form host. Override with `PUBLIC_CONTACT_API_ENDPOINT` when
 * needed. Server secrets: `DAILYBOT_API_KEY` (required); optional Resend ack
 * via `RESEND_API_KEY` + `CONTACT_FROM_EMAIL`.
 */
export const CONTACT_FORM = {
  apiEndpoint: (
    import.meta.env.PUBLIC_CONTACT_API_ENDPOINT || '/api/contact'
  ).trim(),
} as const;
