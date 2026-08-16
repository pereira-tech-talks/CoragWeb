import { type CollectionEntry, getCollection } from 'astro:content';

import {
  ECOSYSTEM_CATEGORIES,
  type EcosystemCategory,
  sortEcosystemApps,
} from '@/lib/ecosystem-apps';

export type EcosystemApp = CollectionEntry<'ecosystemApps'>;

/** Active apps, featured first, then order, then name. */
export async function getEcosystemApps(): Promise<EcosystemApp[]> {
  const all = await getCollection('ecosystemApps');
  const active = all.filter((e) => e.data.active !== false);
  const byName = new Map(active.map((e) => [e.data.name, e]));
  const sortedMeta = sortEcosystemApps(
    active.map((entry) => ({
      name: entry.data.name,
      url: entry.data.url,
      category: entry.data.category,
      featured: entry.data.featured,
      order: entry.data.order,
      active: entry.data.active,
    }))
  );
  return sortedMeta.map((m) => byName.get(m.name)!);
}

export async function loadEcosystemDirectory(): Promise<{
  featured: EcosystemApp | undefined;
  groups: Record<EcosystemCategory, EcosystemApp[]>;
}> {
  const apps = await getEcosystemApps();
  const featured = apps.find((e) => e.data.featured === true);
  const groups = Object.fromEntries(
    ECOSYSTEM_CATEGORIES.map((c) => [c, [] as EcosystemApp[]])
  ) as Record<EcosystemCategory, EcosystemApp[]>;
  for (const app of apps) {
    if (app.data.featured) continue;
    groups[app.data.category].push(app);
  }
  return { featured, groups };
}
