<script lang="ts">
import { onDestroy } from 'svelte';

import { EVENTS, trackEvent } from '@/lib/analytics';

export interface EcosystemApiDocsLabels {
  eyebrow: string;
  title: string;
  lead: string;
  open: string;
  modalTitle: string;
  endpointLabel: string;
  copy: string;
  copied: string;
  factsTitle: string;
  facts: string[];
  shapeTitle: string;
  curlTitle: string;
  agentTitle: string;
  agentLead: string;
  copyPrompt: string;
  prompt: string;
  close: string;
}

interface Props {
  lang: string;
  endpointUrl: string;
  labels: EcosystemApiDocsLabels;
}

let { lang, endpointUrl, labels }: Props = $props();

let open = $state(false);
let copiedKey = $state<string | null>(null);
let dialogEl = $state<HTMLDivElement | undefined>(undefined);
let lastFocusedEl: HTMLElement | null = null;
let copiedTimer: ReturnType<typeof setTimeout> | undefined;

const curlExample = $derived(`curl -s ${endpointUrl}`);

const responseShape = `{
  "version": 1,
  "endpoint": "…/api/ecosystem.json",
  "generatedAt": "ISO-8601",
  "disclosure": { "es": "…", "en": "…" },
  "counts": { "apps": n, "byCategory": { "matching": n, … } },
  "categories": [
    { "id": "matching", "label": { "es", "en" }, "lead": { "es", "en" }, "count": n }
  ],
  "apps": [
    {
      "id", "name", "url", "displayUrl", "category", "featured",
      "tagline": { "es", "en" }, "what": { … }, "how": { … }, "overview": { … },
      "features": [{ "es", "en" }], "tools": [{ "es", "en" }],
      "audience": { … }, "coverage": { … }, "limits": { … },
      "integrations": {
        "publicApi": "yes | no | unknown", "publicMcp": "yes | no | unknown",
        "apiDocsUrl", "openApiUrl", "mcpUrl", "developersUrl", "notes": { … }
      }
    }
  ]
}`;

const focusableSelector =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

async function copyText(what: string, text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    copiedKey = what;
    trackEvent(EVENTS.ECOSYSTEM_API_COPY, { what, lang });
    clearTimeout(copiedTimer);
    copiedTimer = setTimeout(() => {
      copiedKey = null;
    }, 2000);
  } catch {
    // Clipboard API not available — silent fail
  }
}

function trapFocus(e: KeyboardEvent): void {
  if (e.key !== 'Tab' || !dialogEl) return;
  const focusable = Array.from(
    dialogEl.querySelectorAll<HTMLElement>(focusableSelector)
  );
  if (focusable.length === 0) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

function openModal(): void {
  lastFocusedEl = document.activeElement as HTMLElement | null;
  open = true;
  document.body.style.overflow = 'hidden';
  window.addEventListener('keydown', onKeydown);
  trackEvent(EVENTS.ECOSYSTEM_API_MODAL_OPEN, { lang });
  queueMicrotask(() => {
    dialogEl?.focus();
  });
}

function closeModal(): void {
  open = false;
  document.body.style.overflow = '';
  window.removeEventListener('keydown', onKeydown);
  lastFocusedEl?.focus();
  lastFocusedEl = null;
}

function onKeydown(e: KeyboardEvent): void {
  if (!open) return;
  if (e.key === 'Escape') closeModal();
  else trapFocus(e);
}

onDestroy(() => {
  if (typeof document === 'undefined') return;
  document.body.style.overflow = '';
  window.removeEventListener('keydown', onKeydown);
  clearTimeout(copiedTimer);
});
</script>

<section
  id="ecosystem-api"
  class="scroll-mt-24 border-b border-corag-border bg-corag-bg-elevated"
>
  <div class="main-container py-14 sm:py-20">
    <div class="mx-auto max-w-3xl">
      <p
        class="text-sm font-semibold uppercase tracking-widest text-corag-primary dark:text-corag-primary-light"
      >
        {labels.eyebrow}
      </p>
      <h2 class="mt-3 text-3xl font-bold tracking-tight text-corag sm:text-4xl">
        {labels.title}
      </h2>
      <p class="mt-4 text-base leading-relaxed text-corag-secondary">
        {labels.lead}
      </p>

      <div
        class="mt-6 flex flex-col gap-3 rounded-2xl border border-corag-border bg-corag-bg p-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <code
          class="min-w-0 break-all font-mono text-sm text-corag"
        >GET {endpointUrl}</code>
        <button
          type="button"
          class="inline-flex min-h-[44px] shrink-0 cursor-pointer items-center justify-center rounded-full border border-corag-border bg-corag-bg-elevated px-5 text-sm font-semibold text-corag transition hover:border-corag-primary hover:bg-corag-primary-soft"
          onclick={() => copyText('endpoint', endpointUrl)}
        >
          {copiedKey === 'endpoint' ? labels.copied : labels.copy}
        </button>
      </div>

      <div class="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          class="inline-flex min-h-[48px] cursor-pointer items-center justify-center rounded-full bg-corag-fill px-7 text-base font-semibold text-corag-on-fill transition hover:bg-corag-fill-strong"
          onclick={openModal}
        >
          {labels.open}
        </button>
        <button
          type="button"
          class="inline-flex min-h-[48px] cursor-pointer items-center justify-center rounded-full border border-corag-border px-7 text-base font-semibold text-corag transition hover:border-corag-primary hover:bg-corag-primary-soft"
          onclick={() => copyText('prompt-banner', labels.prompt)}
        >
          {copiedKey === 'prompt-banner' ? labels.copied : labels.copyPrompt}
        </button>
      </div>
    </div>
  </div>
</section>

{#if open}
  <div
    class="fixed inset-0 z-[80] flex items-end justify-center bg-black/60 backdrop-blur-[2px] sm:items-center p-[max(0.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))]"
    role="presentation"
    onclick={(e) => {
      if (e.target === e.currentTarget) closeModal();
    }}
  >
    <div
      bind:this={dialogEl}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ecosystem-api-modal-title"
      tabindex="-1"
      class="relative flex w-full max-w-2xl max-h-[calc(100dvh-1.5rem)] flex-col overflow-hidden rounded-t-2xl rounded-b-2xl bg-corag-bg-elevated text-corag shadow-2xl ring-1 ring-corag-border focus:outline-none sm:max-h-[calc(100dvh-2rem)]"
    >
      <button
        type="button"
        class="absolute right-2.5 top-2.5 z-20 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-corag-bg/90 text-corag ring-1 ring-corag-border backdrop-blur-sm transition hover:bg-corag-primary-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-corag-primary sm:right-3 sm:top-3"
        aria-label={labels.close}
        onclick={closeModal}
      >
        <svg
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
          />
        </svg>
      </button>

      <div
        class="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-6 pt-5 sm:px-7 sm:pt-7"
      >
        <h2
          id="ecosystem-api-modal-title"
          class="pr-12 text-2xl font-bold tracking-tight text-corag"
        >
          {labels.modalTitle}
        </h2>

        <section class="mt-6">
          <h3
            class="text-sm font-semibold uppercase tracking-wider text-corag-primary dark:text-corag-primary-light"
          >
            {labels.endpointLabel}
          </h3>
          <div
            class="mt-3 flex flex-col gap-3 rounded-xl border border-corag-border bg-corag-bg p-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <code class="min-w-0 break-all font-mono text-sm text-corag"
              >GET {endpointUrl}</code
            >
            <button
              type="button"
              class="inline-flex min-h-[44px] shrink-0 cursor-pointer items-center justify-center rounded-full border border-corag-border bg-corag-bg-elevated px-4 text-sm font-semibold text-corag transition hover:border-corag-primary hover:bg-corag-primary-soft"
              onclick={() => copyText('endpoint-modal', endpointUrl)}
            >
              {copiedKey === 'endpoint-modal' ? labels.copied : labels.copy}
            </button>
          </div>
        </section>

        <section class="mt-6">
          <h3
            class="text-sm font-semibold uppercase tracking-wider text-corag-primary dark:text-corag-primary-light"
          >
            {labels.factsTitle}
          </h3>
          <ul class="mt-3 space-y-2">
            {#each labels.facts as fact}
              <li
                class="flex gap-3 text-sm leading-relaxed text-corag-secondary"
              >
                <span
                  class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-corag-primary"
                  aria-hidden="true"
                ></span>
                <span>{fact}</span>
              </li>
            {/each}
          </ul>
        </section>

        <section class="mt-6">
          <h3
            class="text-sm font-semibold uppercase tracking-wider text-corag-primary dark:text-corag-primary-light"
          >
            {labels.curlTitle}
          </h3>
          <div class="mt-3 rounded-xl border border-corag-border bg-corag-bg">
            <div class="overflow-x-auto p-3">
              <code class="whitespace-pre font-mono text-sm text-corag"
                >{curlExample}</code
              >
            </div>
          </div>
        </section>

        <section class="mt-6">
          <h3
            class="text-sm font-semibold uppercase tracking-wider text-corag-primary dark:text-corag-primary-light"
          >
            {labels.shapeTitle}
          </h3>
          <div class="mt-3 rounded-xl border border-corag-border bg-corag-bg">
            <div class="overflow-x-auto p-3">
              <pre
                class="whitespace-pre font-mono text-xs leading-relaxed text-corag-secondary">{responseShape}</pre>
            </div>
          </div>
        </section>

        <section
          class="mt-6 rounded-2xl border border-corag-border bg-corag-bg px-4 py-4"
        >
          <h3
            class="text-sm font-semibold uppercase tracking-wider text-corag-primary dark:text-corag-primary-light"
          >
            {labels.agentTitle}
          </h3>
          <p class="mt-2 text-sm leading-relaxed text-corag-secondary">
            {labels.agentLead}
          </p>
          <p
            class="mt-3 rounded-xl border border-corag-border bg-corag-bg-elevated p-3 text-sm leading-relaxed text-corag"
          >
            {labels.prompt}
          </p>
          <button
            type="button"
            class="mt-4 inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-full bg-corag-fill px-6 text-sm font-semibold text-corag-on-fill transition hover:bg-corag-fill-strong"
            onclick={() => copyText('prompt', labels.prompt)}
          >
            {copiedKey === 'prompt' ? labels.copied : labels.copyPrompt}
          </button>
        </section>
      </div>
    </div>
  </div>
{/if}
