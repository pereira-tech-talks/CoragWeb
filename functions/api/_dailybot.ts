/**
 * Shared helpers for POSTing form responses to the DailyBot Forms public API.
 *
 * Corag has two public intakes — the contact form and the conduct report — and
 * each maps to one DailyBot form.
 *
 * **Form and question UUIDs come from the environment, never from source.** The
 * values that used to live here belonged to a different DailyBot workspace;
 * baking any UUID in as a default would mean a misconfigured deploy silently
 * posting real submissions into somebody else's forms. Missing configuration
 * fails closed instead. See `docs/features/FORMS.md`.
 *
 * API contract:
 *   POST https://api.dailybot.com/v1/forms/{form_uuid}/responses/
 *   Header: X-API-KEY: ${DAILYBOT_API_KEY}
 *   Body:   { "content": { "<question_uuid>": <value> }, "automation": true }
 *
 * Multiple-choice note (verified Task 3 smoke): this org's GET payload returns
 * `choices[].value` equal to the label (e.g. "General"). POSTing the slugified
 * label ("general") fails with ["response is not valid"]. Choice lookups
 * therefore resolve aliases → canonical **label**, not slugify(label).
 */

// ────────────────────────────────────────────────────────────────────────────
// Form identifiers
// ────────────────────────────────────────────────────────────────────────────

export interface DailyBotFormConfig {
  uuid: string;
  q: Record<string, string>;
}

export type IntakeForm = 'contact' | 'conduct';

/** Question keys each intake must supply, so a partial config fails loudly. */
const REQUIRED_QUESTIONS: Record<IntakeForm, readonly string[]> = {
  contact: ['NAME', 'EMAIL', 'TOPIC', 'SUBJECT', 'MESSAGE', 'LANG', 'PAGE_PATH'],
  conduct: [
    'INCIDENT',
    'WHEN',
    'PEOPLE',
    'ANONYMOUS',
    'REPORTER_NAME',
    'REPORTER_EMAIL',
    'FOLLOWUP',
    'LANG',
    'PAGE_PATH',
  ],
};

const ENV_KEY: Record<IntakeForm, string> = {
  contact: 'DAILYBOT_CONTACT_FORM',
  conduct: 'DAILYBOT_CONDUCT_FORM',
};

/**
 * Read one intake's DailyBot mapping from the environment.
 *
 * Expected shape (single-line JSON):
 *   {"uuid":"<form-uuid>","q":{"NAME":"<question-uuid>", ...}}
 *
 * Returns `null` when the variable is absent, unparseable, or missing a
 * question the intake needs — the caller turns that into a 503 rather than
 * posting an incomplete response.
 */
export function resolveFormConfig(
  env: Record<string, string | undefined>,
  form: IntakeForm
): DailyBotFormConfig | null {
  const raw = env[ENV_KEY[form]];
  if (!raw) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    console.error(`[dailybot] ${ENV_KEY[form]} is not valid JSON`);
    return null;
  }
  const candidate = parsed as Partial<DailyBotFormConfig>;
  if (typeof candidate?.uuid !== 'string' || !candidate.uuid) return null;
  const q = candidate.q;
  if (!q || typeof q !== 'object') return null;
  const missing = REQUIRED_QUESTIONS[form].filter(
    (key) => typeof q[key] !== 'string' || !q[key]
  );
  if (missing.length > 0) {
    console.error(
      `[dailybot] ${ENV_KEY[form]} is missing question ids: ${missing.join(', ')}`
    );
    return null;
  }
  return { uuid: candidate.uuid, q: q as Record<string, string> };
}

// ────────────────────────────────────────────────────────────────────────────
// Page path normalization
// ────────────────────────────────────────────────────────────────────────────

const PAGE_PATH_MAX_LEN = 200;

export function normalizePagePath(input: unknown): string {
  if (typeof input !== 'string') return '/';
  const trimmed = input.trim();
  if (!trimmed || trimmed.length > PAGE_PATH_MAX_LEN) return '/';
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

// ────────────────────────────────────────────────────────────────────────────
// Slugify (kept for tests / cross-org docs; Corag MC POSTs use labels)
// ────────────────────────────────────────────────────────────────────────────

export function slugify(label: string): string {
  const lower = label.normalize('NFKC').toLowerCase();
  const stripped = lower.replace(/[^\p{L}\p{N}\s_-]/gu, '');
  const collapsed = stripped.replace(/[-\s]+/g, '-');
  return collapsed.replace(/^[-_]+|[-_]+$/g, '');
}

// ────────────────────────────────────────────────────────────────────────────
// Choice lookups — aliases → canonical DailyBot value (label for this org)
// ────────────────────────────────────────────────────────────────────────────

interface ChoiceGroup {
  readonly aliases: readonly string[];
}

function normalizeLabel(label: string): string {
  return label
    .normalize('NFKC')
    .replace(/[–—―]/g, '-')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Build alias → canonical DailyBot value map.
 * First alias is the GET `choices[].value` / label for this org.
 */
function buildChoiceLookup(
  groups: readonly ChoiceGroup[]
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const group of groups) {
    const canonical = group.aliases[0];
    for (const alias of group.aliases) {
      out[normalizeLabel(alias)] = canonical;
    }
  }
  return out;
}

export function lookupChoice(
  label: string | undefined,
  lookup: Record<string, string>
): string | undefined | null {
  if (!label) return undefined;
  const value = lookup[normalizeLabel(label)];
  return value ?? null;
}

/** Map site `lang` (`es`/`en`) and labels to DailyBot Language choices. */
export const LANG_VALUES = buildChoiceLookup([
  { aliases: ['Spanish', 'es', 'español', 'espanol'] },
  { aliases: ['English', 'en', 'inglés', 'ingles'] },
]);

/**
 * Corag's contact topics. The labels must match the choices configured on the
 * DailyBot form exactly — this org's API rejects slugified labels.
 */
export const CONTACT_TOPIC_VALUES = buildChoiceLookup([
  { aliases: ['General', 'general'] },
  { aliases: ['Organization', 'organization', 'org', 'organización'] },
  { aliases: ['Ally', 'ally', 'partner', 'alliance', 'aliado', 'alianza'] },
  { aliases: ['Press', 'press', 'media', 'prensa'] },
  { aliases: ['Report', 'report', 'reporte'] },
  { aliases: ['Other', 'other', 'otro'] },
]);

/**
 * Boolean Dailybot questions require JSON `true` / `false` (not "Yes"/"No").
 * Verified against the DailyBot conduct form (2026-08 audit).
 */
export function booleanToDailyBot(
  value: boolean | string | undefined
): boolean {
  if (typeof value === 'boolean') return value;
  const n = normalizeLabel(String(value ?? ''));
  if (['yes', 'true', '1', 'si', 'sí'].includes(n)) return true;
  if (['no', 'false', '0'].includes(n)) return false;
  return false;
}

// ────────────────────────────────────────────────────────────────────────────
// Fetch wrapper
// ────────────────────────────────────────────────────────────────────────────

export type DailyBotSubmissionError =
  | 'AUTH'
  | 'INVALID_CHOICE'
  | 'MISSING_REQUIRED'
  | 'UNREACHABLE'
  | 'UNKNOWN';

export type DailyBotSubmissionResult =
  | { ok: true; uuid: string }
  | {
      ok: false;
      error: DailyBotSubmissionError;
      status: number;
      detail?: string;
    };

export interface DailyBotEnv {
  DAILYBOT_API_KEY?: string;
}

const BASE_URL = 'https://api.dailybot.com/v1/forms/';

/**
 * POST a form response to DailyBot. Never logs `apiKey`.
 * Always submits with `automation: true`.
 */
export async function submitFormResponse(
  formUuid: string,
  content: Record<string, unknown>,
  env: DailyBotEnv
): Promise<DailyBotSubmissionResult> {
  const apiKey = env.DAILYBOT_API_KEY;
  if (!apiKey) {
    return { ok: false, error: 'AUTH', status: 503, detail: 'missing_api_key' };
  }

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${formUuid}/responses/`, {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content, automation: true }),
    });
  } catch (err) {
    console.error('[dailybot] network error', err);
    return { ok: false, error: 'UNREACHABLE', status: 502 };
  }

  if (response.status === 201) {
    const data = (await response.json().catch(() => ({}))) as { uuid?: string };
    if (!data.uuid) {
      return {
        ok: false,
        error: 'UNKNOWN',
        status: 502,
        detail: 'missing_uuid_in_response',
      };
    }
    return { ok: true, uuid: data.uuid };
  }

  if (response.status === 401 || response.status === 403) {
    return { ok: false, error: 'AUTH', status: 502 };
  }

  const rawBody = await response.text().catch(() => '');
  const detail = classifyDailyBotError(rawBody);

  if (detail === 'INVALID_CHOICE' || detail === 'MISSING_REQUIRED') {
    return { ok: false, error: detail, status: 400 };
  }

  // Do not log response bodies — Dailybot may echo submitted content (incl. CoC).
  console.error('[dailybot] unexpected error', response.status, detail);
  return { ok: false, error: 'UNKNOWN', status: 502 };
}

function classifyDailyBotError(
  rawBody: string
): DailyBotSubmissionError | null {
  if (!rawBody) return null;
  try {
    const parsed = JSON.parse(rawBody) as unknown;
    if (Array.isArray(parsed) && parsed.includes('response is not valid')) {
      return 'INVALID_CHOICE';
    }
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      (parsed as { code?: string }).code === 'all_responses_are_required'
    ) {
      return 'MISSING_REQUIRED';
    }
  } catch {
    // Non-JSON error body
  }
  return null;
}
