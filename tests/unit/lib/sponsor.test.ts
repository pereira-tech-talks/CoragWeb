import { describe, expect, it } from 'vitest';

import type { Meetup } from '@/lib/meetup';
import type { PereiraTechDay } from '@/lib/pereiraTechDay';
import type { Sponsor } from '@/lib/sponsor';
import {
  buildSponsorActivity,
  filterSponsorsByStatus,
  sortSponsors,
  sortSponsorsByOrder,
} from '@/lib/sponsor';

const makeSponsor = (
  id: string,
  overrides: Partial<Sponsor['data']> = {}
): Sponsor =>
  ({
    id,
    collection: 'sponsors',
    data: {
      name: id,
      logo: { light: '/logo.png', dark: '/logo.png', alt: id },
      url: 'https://example.com',
      description: { en: 'desc', es: 'desc' },
      tier: 'gold',
      sponsoredEditions: [],
      status: 'active',
      order: 0,
      ...overrides,
    },
  }) as Sponsor;

describe('sponsor helpers', () => {
  it('sorts sponsors by tier then order (PTD path)', () => {
    const sponsors = sortSponsors([
      makeSponsor('silver', { tier: 'silver', order: 1 }),
      makeSponsor('gold', { tier: 'gold', order: 5 }),
      makeSponsor('gold-first', { tier: 'gold', order: 0 }),
    ]);

    expect(sponsors.map((s) => s.id)).toEqual(['gold-first', 'gold', 'silver']);
  });

  it('sorts community catalog by order then name', () => {
    const sponsors = sortSponsorsByOrder([
      makeSponsor('zeta', { order: 2, name: 'Zeta', tier: 'diamond' }),
      makeSponsor('alpha', { order: 1, name: 'Alpha', tier: 'bronze' }),
      makeSponsor('beta', { order: 1, name: 'Beta', tier: 'diamond' }),
    ]);

    expect(sponsors.map((s) => s.id)).toEqual(['alpha', 'beta', 'zeta']);
  });

  it('filters sponsors by status without overlap', () => {
    const sponsors = [
      makeSponsor('active-one', { status: 'active' }),
      makeSponsor('past-one', { status: 'past' }),
    ];

    const active = filterSponsorsByStatus(sponsors, 'active');
    const past = filterSponsorsByStatus(sponsors, 'past');

    expect(active.map((s) => s.id)).toEqual(['active-one']);
    expect(past.map((s) => s.id)).toEqual(['past-one']);
  });
});

const TODAY = '2026-08-08';

const makeMeetup = (
  id: string,
  date: string,
  sponsors: { slug: string; tier: Sponsor['data']['tier'] }[],
  extra: { talks?: string[]; speakers?: string[]; status?: string } = {}
): Meetup =>
  ({
    id,
    collection: 'meetups',
    data: {
      title: { en: id, es: id },
      description: { en: id, es: id },
      date: new Date(`${date}T00:00:00Z`),
      sponsors,
      talks: extra.talks ?? [],
      speakers: extra.speakers ?? [],
      status: extra.status ?? 'announced',
      draft: false,
    },
  }) as unknown as Meetup;

const makeEdition = (
  year: number,
  sponsors: { slug: string; tier: Sponsor['data']['tier'] }[]
): PereiraTechDay =>
  ({
    id: String(year),
    collection: 'pereiraTechDays',
    data: { year, sponsors },
  }) as unknown as PereiraTechDay;
