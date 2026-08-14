<script lang="ts">
import { EVENTS, trackEvent } from '@/lib/analytics';
import {
  buildGoogleCalendarEmbedUrl,
  type CalendarViewMode,
} from '@/lib/calendar-embed';

export interface SerializedCalendar {
  slug: string;
  name: string;
  description?: string;
  googleCalendarId: string;
  color: string;
  website?: string;
  lumaUrl?: string;
  active: boolean;
  primary: boolean;
  icsUrl: string;
}

interface CalendarPageCopy {
  filterLabel: string;
  filterAll: string;
  viewMonth: string;
  viewAgenda: string;
  legendLabel: string;
  embedTitle: string;
  embedFallback: string;
  openExternal: string;
  subscribeIcs: string;
  lumaRsvp: string;
  websiteLink: string;
  noActiveCalendars: string;
  comingSoon: string;
  inactiveNote: string;
}

interface Props {
  lang: string;
  calendars: SerializedCalendar[];
  inactiveCalendars: SerializedCalendar[];
  copy: CalendarPageCopy;
}

let { lang, calendars, inactiveCalendars, copy }: Props = $props();

let viewMode = $state<CalendarViewMode>('MONTH');
let selectedSlugs = $state<string[]>([]);

$effect(() => {
  if (calendars.length > 0 && selectedSlugs.length === 0) {
    selectedSlugs = calendars.map((c) => c.slug);
  }
});

const allSelected = $derived(
  calendars.length > 0 && selectedSlugs.length === calendars.length
);

const selectedCalendars = $derived(
  calendars.filter((c) => selectedSlugs.includes(c.slug))
);

const embedUrl = $derived(
  buildGoogleCalendarEmbedUrl(
    selectedCalendars.map((c) => ({
      id: c.googleCalendarId,
      color: c.color,
    })),
    { mode: viewMode, lang: lang === 'es' ? 'es' : 'en' }
  )
);

const embedTitle = $derived(
  selectedCalendars.length === 0
    ? copy.embedTitle
    : `${copy.embedTitle}: ${selectedCalendars.map((c) => c.name).join(', ')}`
);

function toggleSlug(slug: string): void {
  if (selectedSlugs.includes(slug)) {
    if (selectedSlugs.length === 1) return;
    selectedSlugs = selectedSlugs.filter((s) => s !== slug);
    trackEvent(EVENTS.CALENDAR_FILTER, { slug, action: 'remove' });
    return;
  }
  selectedSlugs = [...selectedSlugs, slug];
  trackEvent(EVENTS.CALENDAR_FILTER, { slug, action: 'add' });
}

function selectAll(): void {
  selectedSlugs = calendars.map((c) => c.slug);
  trackEvent(EVENTS.CALENDAR_FILTER, { slug: 'all', action: 'select_all' });
}

function setView(mode: CalendarViewMode): void {
  viewMode = mode;
  trackEvent(EVENTS.CALENDAR_VIEW, { mode: mode.toLowerCase() });
}
</script>

{#if calendars.length === 0}
  <p class="text-corag-secondary max-w-2xl">{copy.noActiveCalendars}</p>
{:else}
  <div class="space-y-6">
    <div
      class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
    >
      <div>
        <p
          id="calendar-filter-label"
          class="text-sm font-semibold text-corag mb-2"
        >
          {copy.filterLabel}
        </p>
        <div
          role="group"
          aria-labelledby="calendar-filter-label"
          class="flex flex-wrap gap-2"
        >
          <button
            type="button"
            class="rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-corag-primary focus-visible:ring-offset-2 focus-visible:ring-offset-corag-bg"
            class:border-corag-primary={allSelected}
            class:bg-corag-primary={allSelected}
            class:text-white={allSelected}
            class:dark:bg-corag-primary-light={allSelected}
            class:dark:text-corag-bg={allSelected}
            class:border-corag-border={!allSelected}
            class:bg-corag-bg-elevated={!allSelected}
            class:text-corag={!allSelected}
            aria-pressed={allSelected}
            onclick={selectAll}
          >
            {copy.filterAll}
          </button>
          {#each calendars as cal (cal.slug)}
            {@const pressed = selectedSlugs.includes(cal.slug)}
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-corag-primary focus-visible:ring-offset-2 focus-visible:ring-offset-corag-bg"
              class:border-corag-primary={pressed}
              class:bg-corag-primary={pressed}
              class:text-white={pressed}
              class:dark:bg-corag-primary-light={pressed}
              class:dark:text-corag-bg={pressed}
              class:border-corag-border={!pressed}
              class:bg-corag-bg-elevated={!pressed}
              class:text-corag={!pressed}
              aria-pressed={pressed}
              onclick={() => toggleSlug(cal.slug)}
            >
              <span
                class="h-2.5 w-2.5 shrink-0 rounded-full border border-corag-border"
                style:background-color={cal.color}
                aria-hidden="true"
              ></span>
              {cal.name}
            </button>
          {/each}
        </div>
      </div>

      <div
        role="group"
        aria-label={copy.viewMonth + ' / ' + copy.viewAgenda}
        class="flex rounded-full border border-corag-border bg-corag-bg-elevated p-1"
      >
        <button
          type="button"
          class="rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-corag-primary"
          class:bg-corag-primary={viewMode === 'MONTH'}
          class:text-white={viewMode === 'MONTH'}
          class:dark:bg-corag-primary-light={viewMode === 'MONTH'}
          class:dark:text-corag-bg={viewMode === 'MONTH'}
          class:text-corag={viewMode !== 'MONTH'}
          aria-pressed={viewMode === 'MONTH'}
          onclick={() => setView('MONTH')}
        >
          {copy.viewMonth}
        </button>
        <button
          type="button"
          class="rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-corag-primary"
          class:bg-corag-primary={viewMode === 'AGENDA'}
          class:text-white={viewMode === 'AGENDA'}
          class:dark:bg-corag-primary-light={viewMode === 'AGENDA'}
          class:dark:text-corag-bg={viewMode === 'AGENDA'}
          class:text-corag={viewMode !== 'AGENDA'}
          aria-pressed={viewMode === 'AGENDA'}
          onclick={() => setView('AGENDA')}
        >
          {copy.viewAgenda}
        </button>
      </div>
    </div>

    <p id="calendar-legend-label" class="sr-only">{copy.legendLabel}</p>
    <ul
      aria-labelledby="calendar-legend-label"
      class="flex flex-wrap gap-x-4 gap-y-2 text-sm text-corag-secondary"
    >
      {#each selectedCalendars as cal (cal.slug)}
        <li class="inline-flex items-center gap-2">
          <span
            class="h-2.5 w-2.5 rounded-full border border-corag-border"
            style:background-color={cal.color}
            aria-hidden="true"
          ></span>
          <span>{cal.name}</span>
        </li>
      {/each}
    </ul>

    <div
      class="overflow-hidden rounded-xl border border-corag-border bg-corag-bg-elevated"
    >
      <iframe
        title={embedTitle}
        src={embedUrl}
        class="w-full min-h-[28rem] sm:min-h-[32rem] lg:min-h-[37.5rem] border-0 bg-white"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      ></iframe>
      <p class="px-4 py-3 text-sm text-corag-secondary border-t border-corag-border">
        {copy.embedFallback}
        <a
          href={embedUrl}
          target="_blank"
          rel="noopener noreferrer"
          class="font-medium text-corag-primary dark:text-corag-primary-light underline underline-offset-2"
        >
          {copy.openExternal}
        </a>
      </p>
    </div>

    <ul class="grid gap-3 sm:grid-cols-2">
      {#each selectedCalendars as cal (cal.slug)}
        <li
          class="rounded-xl border border-corag-border bg-corag-bg-elevated px-4 py-3"
        >
          <h3 class="font-semibold text-corag">{cal.name}</h3>
          {#if cal.description}
            <p class="mt-1 text-sm text-corag-secondary">{cal.description}</p>
          {/if}
          <div class="mt-3 flex flex-wrap gap-3 text-sm">
            <a
              href={cal.icsUrl}
              class="font-medium text-corag-primary dark:text-corag-primary-light underline underline-offset-2"
              onclick={() =>
                trackEvent(EVENTS.CALENDAR_SUBSCRIBE, { slug: cal.slug })}
            >
              {copy.subscribeIcs}
            </a>
            {#if cal.lumaUrl}
              <a
                href={cal.lumaUrl}
                target="_blank"
                rel="noopener noreferrer"
                class="font-medium text-corag-primary dark:text-corag-primary-light underline underline-offset-2"
                onclick={() =>
                  trackEvent(EVENTS.CALENDAR_LUMA, { slug: cal.slug })}
              >
                {copy.lumaRsvp}
              </a>
            {/if}
            {#if cal.website}
              <a
                href={cal.website}
                target="_blank"
                rel="noopener noreferrer"
                class="font-medium text-corag-primary dark:text-corag-primary-light underline underline-offset-2"
              >
                {copy.websiteLink}
              </a>
            {/if}
          </div>
        </li>
      {/each}
    </ul>
  </div>
{/if}

{#if inactiveCalendars.length > 0}
  <div class="mt-10">
    <h3 class="text-lg font-semibold text-corag">{copy.comingSoon}</h3>
    <p class="mt-2 text-sm text-corag-secondary">{copy.inactiveNote}</p>
    <ul class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {#each inactiveCalendars as cal (cal.slug)}
        <li
          class="rounded-xl border border-dashed border-corag-border px-4 py-3 opacity-90"
        >
          <div class="flex items-center gap-2">
            <span
              class="h-2.5 w-2.5 rounded-full border border-corag-border"
              style:background-color={cal.color}
              aria-hidden="true"
            ></span>
            <span class="font-medium text-corag">{cal.name}</span>
          </div>
          {#if cal.description}
            <p class="mt-2 text-sm text-corag-secondary">{cal.description}</p>
          {/if}
        </li>
      {/each}
    </ul>
  </div>
{/if}

<style>
  @media (prefers-reduced-motion: reduce) {
    button {
      transition: none;
    }
  }
</style>
