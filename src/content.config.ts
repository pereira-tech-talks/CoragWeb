import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Reusable Zod helpers for v3.0.0 collections.
 */

// String value or an {en, es} object. New collections (meetups, events,
// PTDs, verticals, etc.) accept either form. The string form is treated as
// language-neutral and is rendered as-is for both languages.
const i18nString = z.union([
  z.string(),
  z.object({ en: z.string(), es: z.string() }),
]);

const i18nStringOptional = z
  .union([
    z.string(),
    z.object({ en: z.string().optional(), es: z.string().optional() }),
  ])
  .optional();

const heroLayout = z
  .enum(['banner', 'side-by-side', 'minimal', 'none'])
  .default('banner');

const venue = z.object({
  name: z.string(),
  addressLine: z.string().optional(),
  city: z.string(),
  country: z.string(),
  mapUrl: z.string().optional(),
});

const eventLocation = venue.extend({
  online: z.boolean().default(false),
  streamUrl: z.string().optional(),
});

const sponsorTier = z.enum([
  'diamond',
  'gold',
  'silver',
  'bronze',
  'community',
]);

const sponsorRef = z.object({
  slug: z.string(),
  tier: sponsorTier,
});

/**
 * `postponed` is a *reversible* state: the event is not happening on the
 * announced date, but it is not cancelled either and will be rescheduled.
 * All registration CTAs, countdowns, and commercial sections are suppressed at
 * the render layer while it is set — the underlying data (dates, Luma link,
 * sponsorship plans) stays untouched so restoring the edition is a one-line
 * status change. See docs/features/PEREIRA_TECH_DAYS.md#postponing-an-edition.
 */
const eventStatus = z.enum([
  'announced',
  'rsvp-open',
  'postponed',
  'completed',
  'cancelled',
]);

const blog = defineCollection({
  loader: glob({
    base: './src/content/blog',
    pattern: '**/*.{md,mdx}',
    generateId: ({ entry }) => entry.replace(/\.(md|mdx)$/i, ''),
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    heroLayout: z
      .enum(['banner', 'side-by-side', 'minimal', 'none'])
      .default('banner')
      .optional(),
    tags: z.array(z.string()).optional(),
    keywords: z.array(z.string()).optional(),
    series: z.string().optional(),
    seriesOrder: z.number().optional(),
    relatedSlide: z.string().optional(),
    author: z.string().default('sergio-florez'),
    draft: z.boolean().default(false).optional(),
  }),
});

const tags = defineCollection({
  loader: glob({ base: './src/content/tags', pattern: '**/*.md' }),
  schema: z.object({
    name: z.string(),
    description: z.string().optional(),
    tier: z.enum(['primary', 'secondary', 'subtopic']).default('primary'),
    parent: z.string().optional(),
    order: z.number().default(0),
  }),
});

const series = defineCollection({
  loader: glob({ base: './src/content/series', pattern: '**/*.md' }),
  schema: z.object({
    name: z.string(),
    title: z.string(),
    description: z.string().optional(),
    order: z.number().default(0),
    heroImage: z.string().optional(),
    heroImageEs: z.string().optional(),
    keywords: z.array(z.string()).optional(),
  }),
});

const pages = defineCollection({
  loader: glob({
    base: './src/content/pages',
    pattern: '**/*.md',
    generateId: ({ entry }) => entry.replace(/\.md$/i, ''),
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    lastUpdated: z.coerce.date().optional(),
  }),
});

const authors = defineCollection({
  loader: glob({ base: './src/content/authors', pattern: '**/*.yaml' }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    avatar: z.string(),
    role: z.object({
      en: z.string(),
      es: z.string(),
    }),
    bio: z.object({
      en: z.string(),
      es: z.string(),
    }),
    social: z
      .object({
        x: z.string().optional(),
        linkedin: z.string().optional(),
        github: z.string().optional(),
        instagram: z.string().optional(),
        website: z.string().optional(),
      })
      .optional(),
  }),
});

/**
 * NEW v3.0.0 COLLECTIONS
 */

/**
 * English bodies for meetups, as `{slug}.en.md` siblings.
 *
 * A meetup keeps ONE source of truth for its structured data (date, venue,
 * speakers, talks, sponsors); only the prose needs a language dimension. Both
 * bodies stay real Markdown files so they render through the same Sätteri
 * pipeline.
 *
 * `generateId` strips `.en`, so an entry's id equals its meetup's id and the
 * join needs no mapping table.
 */

const events = defineCollection({
  loader: glob({
    base: './src/content/events',
    pattern: '**/*.{md,mdx,yaml}',
    generateId: ({ entry }) => entry.replace(/\.(md|mdx|yaml)$/i, ''),
  }),
  schema: z.object({
    title: i18nString,
    description: i18nString,
    type: z.enum([
      'meetup',
      'workshop',
      'hackathon',
      'conference',
      'webinar',
      'pereira-tech-day',
    ]),
    date: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    location: eventLocation,
    hero: z
      .object({
        src: z.string(),
        alt: i18nStringOptional,
        layout: heroLayout,
      })
      .optional(),
    sponsors: z.array(sponsorRef).default([]),
    verticals: z.array(z.string()).default([]),
    related: z
      .array(
        z.object({
          collection: z.enum(['meetups', 'pereiraTechDays', 'talks']),
          slug: z.string(),
        })
      )
      .default([]),
    status: eventStatus.default('announced'),
    draft: z.boolean().default(false),
  }),
});

/**
 * English bodies for verticals, as `{slug}.en.md` siblings.
 *
 * Same mechanism as `meetupBodiesEn`: the vertical keeps ONE source of truth
 * for its structured data (title, mission, leaders, schedule) and only the
 * prose gets a language dimension.
 */

const sponsors = defineCollection({
  loader: glob({ base: './src/content/sponsors', pattern: '**/*.yaml' }),
  schema: z.object({
    name: z.string(),
    logo: z.object({
      light: z.string(),
      dark: z.string(),
      alt: z.string(),
    }),
    url: z.url(),
    description: i18nString,
    tier: sponsorTier,
    sponsoredEditions: z
      .array(
        z.object({
          year: z.number().int(),
          tier: sponsorTier,
        })
      )
      .default([]),
    status: z.enum(['active', 'past']).default('active'),
    order: z.number().default(0),
  }),
});

const channels = defineCollection({
  loader: glob({ base: './src/content/channels', pattern: '**/*.yaml' }),
  schema: z.object({
    name: z.string(),
    platform: z.enum([
      'discord',
      'whatsapp',
      'telegram',
      'meetup-com',
      'luma',
      'youtube',
      'x',
      'linkedin',
      'instagram',
      'github',
      'linktree',
      'newsletter',
      'website',
      'other',
    ]),
    url: z.url(),
    description: i18nString,
    audience: i18nString,
    isPrimary: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

const contributors = defineCollection({
  // Distinct from `authors` (which stays the canonical author collection for
  // blog posts). Contributors include all kinds of community members:
  // organizers, vertical leads, mentors, volunteers, sponsor liaisons.
  loader: glob({ base: './src/content/contributors', pattern: '**/*.yaml' }),
  schema: z.object({
    name: z.string(),
    pronouns: z.string().optional(),
    avatar: z.string(),
    roles: z
      .array(
        z.enum([
          'founding-organizer',
          'organizer',
          'vertical-lead',
          'mentor',
          'speaker',
          'contributor',
          'sponsor-liaison',
          'press-lead',
          'conduct-team',
          'alumni',
        ])
      )
      .min(1),
    primaryVertical: z.string().optional(),
    role: z.object({
      en: z.string(),
      es: z.string(),
    }),
    bio: z.object({
      en: z.string(),
      es: z.string(),
    }),
    social: z
      .object({
        x: z.string().optional(),
        linkedin: z.string().optional(),
        github: z.string().optional(),
        instagram: z.string().optional(),
        website: z.string().optional(),
        mastodon: z.string().optional(),
        bluesky: z.string().optional(),
      })
      .optional(),
    activeSince: z.coerce.date().optional(),
    inactiveSince: z.coerce.date().optional(),
    order: z.number().default(0),
  }),
});

/**
 * Public Google Calendars for allied Pereira tech communities.
 * IDs must be embeddable (public); no API keys.
 */

/**
 * Site-wide top notifications / alerts with date windows.
 * Plain strings only (no HTML) — rendered as text in the bar/modal.
 * CTA hrefs: internal paths or absolute http(s) only (blocks javascript:/data:).
 */
const notificationSafeHref = z
  .string()
  .regex(
    /^(\/(?!\/)|https?:\/\/)/,
    'ctaHref must be an internal path (starting with /) or an absolute http(s) URL'
  );

const notifications = defineCollection({
  loader: glob({
    base: './src/content/notifications',
    pattern: '**/*.{yaml,yml}',
  }),
  schema: z.object({
    severity: z
      .enum(['info', 'important', 'success', 'warning'])
      .default('info'),
    title: z.object({ en: z.string(), es: z.string() }),
    summary: z.object({ en: z.string(), es: z.string() }),
    body: z
      .object({ en: z.string().optional(), es: z.string().optional() })
      .optional(),
    /** Optional modal hero (e.g. PTD card art). Prefer landscape ~16:9. */
    image: z
      .object({
        /** String = both languages; `{ en, es }` when the art is localized. */
        src: i18nString,
        alt: z.object({ en: z.string(), es: z.string() }),
      })
      .optional(),
    ctaLabel: z.object({ en: z.string(), es: z.string() }).optional(),
    ctaHref: notificationSafeHref.optional(),
    modalEnabled: z.boolean().default(false),
    startsAt: z.coerce.date(),
    endsAt: z.coerce.date(),
    priority: z.number().int().default(0),
    active: z.boolean().default(true),
  }),
});

export const collections = {
  // Existing
  blog,
  tags,
  series,
  pages,
  authors,
  // v3.0.0 — community website model
  events,
  sponsors,
  channels,
  contributors,
  notifications,
};
