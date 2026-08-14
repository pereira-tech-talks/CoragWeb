import { type CollectionEntry, getCollection } from 'astro:content';

export type Sponsor = CollectionEntry<'sponsors'>;

export type SponsorTier = Sponsor['data']['tier'];

const tierOrder: Record<Sponsor['data']['tier'], number> = {
  diamond: 0,
  gold: 1,
  silver: 2,
  bronze: 3,
  community: 4,
};

/** Singular, human-facing tier names. Plural section headings live in i18n. */
export const SPONSOR_TIER_LABELS: Record<
  SponsorTier,
  { en: string; es: string }
> = {
  diamond: { en: 'Diamond', es: 'Diamante' },
  gold: { en: 'Gold', es: 'Oro' },
  silver: { en: 'Silver', es: 'Plata' },
  bronze: { en: 'Bronze', es: 'Bronce' },
  community: { en: 'Community', es: 'Comunidad' },
};

const sortByTierThenOrder = (a: Sponsor, b: Sponsor): number => {
  const ta = tierOrder[a.data.tier];
  const tb = tierOrder[b.data.tier];
  if (ta !== tb) return ta - tb;
  return (a.data.order ?? 0) - (b.data.order ?? 0);
};

export const sortSponsors = (sponsors: Sponsor[]): Sponsor[] =>
  [...sponsors].sort(sortByTierThenOrder);

/** Community catalog sort — order then name (no tier grouping). */
export const sortSponsorsByOrder = (sponsors: Sponsor[]): Sponsor[] =>
  [...sponsors].sort((a, b) => {
    const oa = a.data.order ?? 0;
    const ob = b.data.order ?? 0;
    if (oa !== ob) return oa - ob;
    return a.data.name.localeCompare(b.data.name);
  });

export const filterSponsorsByStatus = (
  sponsors: Sponsor[],
  status: Sponsor['data']['status']
): Sponsor[] => sponsors.filter((s) => s.data.status === status);

export const getSponsors = async (): Promise<Sponsor[]> => {
  const all = await getCollection('sponsors');
  return sortSponsors(all);
};

export const getActiveSponsors = async (): Promise<Sponsor[]> => {
  const all = await getSponsors();
  return sortSponsorsByOrder(filterSponsorsByStatus(all, 'active'));
};

export const getPastSponsors = async (): Promise<Sponsor[]> => {
  const all = await getSponsors();
  return sortSponsorsByOrder(filterSponsorsByStatus(all, 'past'));
};

export const getSponsorBySlug = async (
  slug: string
): Promise<Sponsor | undefined> => {
  const all = await getSponsors();
  return all.find((s) => s.id === slug);
};

export const getSponsorsByTier = async (
  tier: Sponsor['data']['tier']
): Promise<Sponsor[]> => {
  const all = await getSponsors();
  return all.filter((s) => s.data.tier === tier);
};

export const getSponsorsByEdition = async (
  year: number
): Promise<Sponsor[]> => {
  const all = await getSponsors();
  return all
    .filter((s) => s.data.sponsoredEditions.some((e) => e.year === year))
    .sort(sortByTierThenOrder);
};
