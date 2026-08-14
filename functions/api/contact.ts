/**
 * Cloudflare Pages Function — Corag intake → Dailybot Forms API.
 *
 * Primary sink: Dailybot (`DAILYBOT_API_KEY`). Discriminator `_form`:
 *   contact | conduct
 *
 * Clients that send only `reason` / `topic` (without `_form`) are mapped:
 * conduct/report→conduct, everything else→contact.
 *
 * Optional Resend auto-ack after Dailybot 201 (never fails the request).
 *
 * Env:
 *   DAILYBOT_API_KEY — required
 *   DAILYBOT_CONTACT_FORM, DAILYBOT_CONDUCT_FORM — required JSON form mappings
 *   RESEND_API_KEY, CONTACT_FROM_EMAIL — optional ack
 *   CONTACT_ALLOWED_ORIGINS, CONTACT_RATE_LIMIT, CONTACT_RATE_WINDOW_MS
 *   CONTACT_TURNSTILE_SECRET — reserved
 */

import {
  CONTACT_TOPIC_VALUES,
  type DailyBotFormConfig,
  LANG_VALUES,
  booleanToDailyBot,
  lookupChoice,
  normalizePagePath,
  resolveFormConfig,
  submitFormResponse,
} from './_dailybot';
import {
  checkRateLimit,
  looksLikeSpamPayload,
  normalizeTopic,
  pickAckCopy,
} from '../_lib/intake-helpers';

const MAX_NAME_LENGTH = 120;
const MAX_SUBJECT_LENGTH = 140;
const MAX_MESSAGE_LENGTH = 2000;
const MAX_EMAIL_LENGTH = 254;

const FORM_TYPES = ['contact', 'conduct'] as const;
type FormType = (typeof FORM_TYPES)[number];

interface Env {
  DAILYBOT_API_KEY?: string;
  DAILYBOT_CONTACT_FORM?: string;
  DAILYBOT_CONDUCT_FORM?: string;
  RESEND_API_KEY?: string;
  CONTACT_FROM_EMAIL?: string;
  CONTACT_ALLOWED_ORIGINS?: string;
  CONTACT_RATE_LIMIT?: string;
  CONTACT_RATE_WINDOW_MS?: string;
  CONTACT_TURNSTILE_SECRET?: string;
}

interface EventContext {
  request: Request;
  env: Env;
  waitUntil: (promise: Promise<unknown>) => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const rateLimitStore = new Map<string, number[]>();

function jsonResponse(
  data: unknown,
  status: number,
  origin: string,
  extraHeaders?: Record<string, string>
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      Vary: 'Origin',
      'Cache-Control': 'no-store',
      ...(extraHeaders || {}),
    },
  });
}

function resolveAllowedOrigin(request: Request, env: Env): string {
  const requestOrigin = request.headers.get('Origin') || '';
  const allowlist = (env.CONTACT_ALLOWED_ORIGINS || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  if (allowlist.length === 0) {
    return requestOrigin || '*';
  }
  if (requestOrigin && allowlist.includes(requestOrigin)) {
    return requestOrigin;
  }
  return allowlist[0];
}

function sanitiseText(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return '';
  return value.replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, maxLength);
}

function asBool(value: unknown): boolean {
  return value === true || value === 'true' || value === '1' || value === 'on';
}

function resolveFormType(data: Record<string, unknown>): FormType {
  const raw = data._form;
  if (typeof raw === 'string' && (FORM_TYPES as readonly string[]).includes(raw)) {
    return raw as FormType;
  }
  const reason = normalizeTopic(
    sanitiseText(data.reason ?? data.topic, 64)
  );
  if (reason === 'conduct') return 'conduct';
  return 'contact';
}

interface ContentBuildResult {
  ok: true;
  formUuid: string;
  content: Record<string, string | boolean>;
  ackTopic: string;
}

interface ContentBuildError {
  ok: false;
  error: string;
}

function requireNonEmpty(
  fields: Record<string, string>,
  keys: string[]
): ContentBuildError | null {
  const missing = keys.filter((k) => !fields[k]?.trim());
  if (missing.length === 0) return null;
  return { ok: false, error: `missing_${missing[0]}` };
}

function buildContent(
  formType: FormType,
  config: DailyBotFormConfig,
  fields: Record<string, string>,
  flags: Record<string, boolean>,
  pagePath: string,
  langRaw: string
): ContentBuildResult | ContentBuildError {
  const lang =
    lookupChoice(langRaw || 'es', LANG_VALUES) ||
    lookupChoice('Spanish', LANG_VALUES);
  if (!lang) {
    return { ok: false, error: 'lang_invalid' };
  }
  const q = config.q;

  if (formType === 'contact') {
    const missing = requireNonEmpty(fields, [
      'name',
      'email',
      'topic',
      'subject',
      'message',
    ]);
    if (missing) return missing;
    const topic = lookupChoice(fields.topic, CONTACT_TOPIC_VALUES);
    if (topic === null) return { ok: false, error: 'topic_invalid' };
    return {
      ok: true,
      formUuid: config.uuid,
      ackTopic: fields.topic || 'general',
      content: {
        [q.NAME]: fields.name,
        [q.EMAIL]: fields.email,
        [q.TOPIC]: topic as string,
        [q.SUBJECT]: fields.subject,
        [q.MESSAGE]: fields.message,
        [q.LANG]: lang,
        [q.PAGE_PATH]: pagePath,
      },
    };
  }

  // conduct
  const missing = requireNonEmpty(fields, ['incidentDescription']);
  if (missing) return missing;
  const anonymous = flags.anonymous;
  const content: Record<string, string | boolean> = {
    [q.INCIDENT]: fields.incidentDescription,
    [q.WHEN]: fields.incidentDate || '',
    [q.PEOPLE]: fields.peopleInvolved || '',
    [q.ANONYMOUS]: booleanToDailyBot(anonymous),
    [q.REPORTER_NAME]: anonymous ? '' : fields.name || '',
    [q.REPORTER_EMAIL]: anonymous ? '' : fields.email || '',
    [q.FOLLOWUP]: fields.preferredFollowup || '',
    [q.LANG]: lang,
    [q.PAGE_PATH]: pagePath,
  };
  // Legacy contact-shaped conduct: use message as incident if needed
  if (!content[q.INCIDENT] && fields.message) {
    content[q.INCIDENT] = fields.message;
  }
  return {
    ok: true,
    formUuid: config.uuid,
    ackTopic: 'conduct',
    content,
  };
}

async function resendAck(
  env: Env,
  to: string,
  topic: string,
  lang: 'en' | 'es'
): Promise<void> {
  if (!env.RESEND_API_KEY || !env.CONTACT_FROM_EMAIL || !to) return;
  const ack = pickAckCopy(topic, lang);
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: env.CONTACT_FROM_EMAIL,
        to: [to],
        subject: ack.subject,
        text: ack.text,
      }),
    });
  } catch (err) {
    console.error('[contact] Resend ack failed', err);
  }
}

export async function onRequestOptions(
  context: EventContext
): Promise<Response> {
  const origin = resolveAllowedOrigin(context.request, context.env);
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
      Vary: 'Origin',
    },
  });
}

export async function onRequestPost(
  context: EventContext
): Promise<Response> {
  const origin = resolveAllowedOrigin(context.request, context.env);

  if (!context.env.DAILYBOT_API_KEY) {
    return jsonResponse(
      { ok: false, error: 'backend_not_configured' },
      503,
      origin
    );
  }

  let raw: unknown;
  try {
    raw = await context.request.json();
  } catch {
    return jsonResponse({ ok: false, error: 'invalid_json' }, 400, origin);
  }
  if (!raw || typeof raw !== 'object') {
    return jsonResponse({ ok: false, error: 'invalid_payload' }, 400, origin);
  }

  const data = raw as Record<string, unknown>;
  void context.env.CONTACT_TURNSTILE_SECRET;

  const ip =
    context.request.headers.get('CF-Connecting-IP') ||
    context.request.headers.get('X-Forwarded-For') ||
    'unknown';

  const limit = Number(context.env.CONTACT_RATE_LIMIT || '8');
  const windowMs = Number(context.env.CONTACT_RATE_WINDOW_MS || '600000');
  const rl = checkRateLimit(rateLimitStore, ip, limit, windowMs);
  if (!rl.allowed) {
    return jsonResponse(
      { ok: false, error: 'rate_limited' },
      429,
      origin,
      { 'Retry-After': String(rl.retryAfterSec) }
    );
  }

  const website = sanitiseText(data.website, 200);
  const name = sanitiseText(data.name, MAX_NAME_LENGTH);
  const message = sanitiseText(
    data.message ?? data.incidentDescription,
    MAX_MESSAGE_LENGTH
  );
  if (looksLikeSpamPayload({ name, message, website })) {
    return jsonResponse({ ok: true }, 200, origin);
  }

  const formType = resolveFormType(data);
  let email = sanitiseText(data.email, MAX_EMAIL_LENGTH).toLowerCase();
  const langRaw = sanitiseText(data.lang, 16) || 'es';

  const isAnonymousConduct =
    formType === 'conduct' && asBool(data.anonymous);

  // Contact / most forms need email; anonymous conduct may omit it
  if (!isAnonymousConduct) {
    if (!email || !EMAIL_REGEX.test(email)) {
      return jsonResponse({ ok: false, error: 'email_invalid' }, 400, origin);
    }
  } else {
    // Drop any sneaked identity before Dailybot mapping / Resend ack.
    email = '';
  }

  const reason = normalizeTopic(sanitiseText(data.reason ?? data.topic, 64));
  const topicForContact =
    formType === 'contact'
      ? reason && reason !== 'conduct'
        ? reason
        : sanitiseText(data.topic, 64) || 'general'
      : '';

  const fields: Record<string, string> = {
    name,
    email,
    topic: topicForContact || sanitiseText(data.topic, 64) || reason,
    subject: sanitiseText(data.subject, MAX_SUBJECT_LENGTH),
    message: sanitiseText(data.message, MAX_MESSAGE_LENGTH),
    incidentDescription: sanitiseText(
      data.incidentDescription ?? data.message,
      MAX_MESSAGE_LENGTH
    ),
    incidentDate: sanitiseText(data.incidentDate, 120),
    peopleInvolved: sanitiseText(data.peopleInvolved, MAX_MESSAGE_LENGTH),
    preferredFollowup: sanitiseText(data.preferredFollowup, MAX_MESSAGE_LENGTH),
  };

  const flags = { anonymous: asBool(data.anonymous) };

  const config = resolveFormConfig(
    context.env as Record<string, string | undefined>,
    formType
  );
  if (!config) {
    return jsonResponse(
      { ok: false, error: 'backend_not_configured' },
      503,
      origin
    );
  }

  const pagePath = normalizePagePath(data.page_path ?? data.pagePath);
  const built = buildContent(formType, config, fields, flags, pagePath, langRaw);
  if (!built.ok) {
    return jsonResponse({ ok: false, error: built.error }, 400, origin);
  }

  const result = await submitFormResponse(
    built.formUuid,
    built.content,
    context.env
  );
  if (!result.ok) {
    const error =
      result.error === 'INVALID_CHOICE'
        ? 'invalid_choice'
        : result.error === 'MISSING_REQUIRED'
          ? 'missing_required'
          : result.error === 'AUTH'
            ? 'backend_not_configured'
            : 'send_failed';
    return jsonResponse({ ok: false, error }, result.status, origin);
  }

  const ackLang = langRaw === 'en' ? 'en' : 'es';
  // Never email-ack anonymous CoC reports (even if a client sneaks an address).
  const allowAck = !(formType === 'conduct' && flags.anonymous);
  if (allowAck && email) {
    context.waitUntil(
      resendAck(context.env, email, built.ackTopic, ackLang).then(() => undefined)
    );
  }

  return jsonResponse(
    { ok: true, recordUuid: result.uuid, formType },
    200,
    origin
  );
}

export async function onRequest(context: EventContext): Promise<Response> {
  if (context.request.method === 'OPTIONS') {
    return onRequestOptions(context);
  }
  if (context.request.method === 'POST') {
    return onRequestPost(context);
  }
  const origin = resolveAllowedOrigin(context.request, context.env);
  return jsonResponse({ ok: false, error: 'method_not_allowed' }, 405, origin);
}
