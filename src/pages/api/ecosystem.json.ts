import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

import { buildEcosystemApiPayload } from '@/lib/ecosystem-api';

export const GET: APIRoute = async () => {
  const entries = await getCollection('ecosystemApps');
  const payload = buildEcosystemApiPayload(
    entries.map((e) => ({ id: e.id, data: e.data })),
    new Date().toISOString()
  );

  return new Response(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
    },
  });
};
