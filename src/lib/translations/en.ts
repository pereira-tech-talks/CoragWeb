/**
 * English translations
 */

import type { SiteTranslations } from './types';

export const en: SiteTranslations = {
  // Site metadata
  home: {
    eyebrow: 'The social impact ecosystem',
    title: 'We have the courage to serve and transform lives',
    lead: 'We connect people who want to help with those who need it most, so that aid is transparent, measurable and consistent.',
    ctaPrimary: 'I want to help',
    ctaSecondary: 'How it works',

    problemEyebrow: 'The problem',
    problemTitle: 'The intent is there. The connection is what fails.',
    problemBody:
      'Plenty of people want to give or get involved, but cannot find a way to do it that feels trustworthy, close and meaningful. Generosity is not the scarce resource — connection is. Aid ends up scattered across places that never talk to each other.',
    problemFragments: [
      'WhatsApp threads',
      'One-off forms',
      'Spreadsheets',
      'Phone calls',
      'Posts that get buried',
      'Lists nobody updates',
    ],

    howEyebrow: 'How it works',
    howTitle: 'A bridge between the person who needs and the person who can',
    howBody:
      'A need is published, located and categorized. Someone who can help finds it. It gets coordinated, delivered, and what happened is on the record.',
    howSteps: [
      {
        title: 'It is published',
        body: 'A person or community describes what they need, where, and how urgently.',
      },
      {
        title: 'It is found',
        body: 'Someone who can help sees it on the map, filtered by proximity and by type of aid.',
      },
      {
        title: 'It is coordinated',
        body: 'A named person organizes the delivery, often inside an operational front.',
      },
      {
        title: 'The evidence stays',
        body: 'Proof is uploaded, reviewed, and only then published.',
      },
    ],
    howCta: 'See the whole path',

    trustEyebrow: 'Transparency',
    trustTitle:
      'Saying you are transparent is easy. Publishing the receipt takes courage.',
    trustBody:
      'That is why every contribution has a named person behind it and every peso has a destination you can check. We publish two separate numbers, and both are public.',
    pillars: [
      {
        title: 'Received',
        body: 'How much came in. It is the easy number to show, and on its own it says nothing.',
      },
      {
        title: 'Used with evidence',
        body: 'How much was spent with verified proof: receipts, photos, results. This is the number that matters.',
      },
      {
        title: 'Direct transfer',
        body: 'Money goes to verified leaders’ accounts, not to a central treasury. Every contribution is attributable.',
      },
    ],
    trustCta: 'How traceability works',

    productEyebrow: 'Flagship product',
    productTitle: 'Ayuda Directa',
    productBody:
      'Publishing a need, offering help, contributing and tracking your contribution all happen in the application. That is where the map, the operational fronts, the responsables and the evidence live.',
    productCta: 'Join the movement',
    productPhotoAlt:
      'Two volunteers hand a parcel of groceries to a man in a rural settlement',

    devEyebrow: 'Interoperability',
    devTitle: 'Many interfaces, one network of data',
    devBody:
      'During an emergency several applications appear at once, each with its own database of needs. The result is more fragmentation, not less. That is why we publish an open API: so a new application becomes a client of the same network rather than another silo.',
    devCta: 'Developer documentation',

    closingTitle: 'Will you join?',
    closingBody:
      'If you want to help, contribute or publish a need, that happens in the application. If you build software, want to become an ally, or want to join the team, start here.',
    closingCtaApp: 'Go to the app',
    closingCtaTeam: 'I want to contribute',
  },
  siteTitle: 'Corag',
  siteTitleFull: 'Corag — The social impact ecosystem',
  siteDescription:
    'We connect people who want to help with those who need it most, so that aid is transparent, measurable and consistent.',

  // Navigation
  nav: {
    app: 'Go to the app',
    home: 'Home',
    blog: 'Blog',
    about: 'About Corag',
    contact: 'Contact',
    community: 'Community',
    contributors: 'Contributors',
    channels: 'Channels',
    menu: 'Menu',
    closeMenu: 'Close menu',
    openMenu: 'Open menu',
  },

  // Footer
  footer: {
    copyright: 'Corag',
    allRightsReserved: 'All rights reserved.',
    tagline: 'The social impact ecosystem.',
    appNote:
      'Publishing a need, offering help, contributing and tracking your contribution all happen in the application.',
  },

  // Homepage sections
  homeSections: {
    latestArticles: 'From the blog',
    viewAllPosts: 'View all articles',
  },

  // Contact section (homepage)
  contact: {
    title: 'Contact',
    nameLabel: 'Name',
    namePlaceholder: 'Your name',
    emailLabel: 'Email',
    emailPlaceholder: 'your@email.com',
    messageLabel: 'Message',
    messagePlaceholder: 'Write your message...',
    sendButton: 'Send message',
  },

  // About page

  aboutPage: {
    title: 'About Corag',
    subtitle: 'The social impact ecosystem',
    description:
      'What Corag is, where the name comes from, how the model works, and why evidence sits at the centre of it.',
    heroDescription:
      'We started as a group of young people who cared about social service. Out of that came the purpose of building a digital bridge between those who want to help and those who need it most.',
    bioTitle: 'We have the courage to serve and transform lives',
    bioText:
      'The name comes from <strong>coraje</strong> — courage. The heart replacing the <em>o</em> carries <strong>love</strong>. Our mark is built to transmit courage, innovation and love.<br /><br />Courage here is not bravado. It is showing up when it is inconvenient, putting your name on a delivery, and publishing the account afterwards. That last part is what connects the idea to the product: named responsables, direct transfer and moderated evidence are courage turned into a mechanism. Saying you are transparent is easy; publishing the receipt takes courage.<br /><br />Corag exists because of a simple reality: plenty of people want to give or get involved, but cannot find a way to do it that feels trustworthy, close and meaningful. Generosity is not the scarce resource — connection is.',
    passionsTitle: 'Our values',
    passions: [
      {
        title: 'Collaboration',
        description:
          'We bring governments, organizations, companies and individuals into one network instead of multiplying isolated systems.',
        icon: 'users',
        link: '/how-it-works',
      },
      {
        title: 'Empathy',
        description:
          "Someone receiving aid is a neighbour, not the backdrop for somebody else's virtue.",
        icon: 'heart',
        link: '/how-it-works',
      },
      {
        title: 'Trust',
        description:
          'Every contribution has a named person behind it and a destination you can check.',
        icon: 'shield',
        link: '/transparency',
      },
      {
        title: 'Love',
        description:
          'It is in the heart at the centre of the mark, and in the reason any of this exists.',
        icon: 'heart',
        link: '/about',
      },
      {
        title: 'Social innovation',
        description:
          'A public API, an OpenAPI specification and an MCP server, so others can build on the same network.',
        icon: 'sparkles',
        link: '/developers',
      },
      {
        title: 'Transparency',
        description:
          'We publish how much came in and how much was used with evidence. Two separate numbers, both public.',
        icon: 'eye',
        link: '/transparency',
      },
    ],
    quickFactsTitle: 'In short',
    quickFacts: [
      'Corag is the ecosystem; Ayuda Directa is the flagship product',
      'Coordination, contributions and evidence all happen in the application',
      'Money moves by direct transfer to verified responsables',
      'Evidence is moderated before it is published',
      'A public API, OpenAPI 3.1 and an MCP server are open to any integrator',
    ],
    ctaTitle: 'Want to be part of it?',
    ctaDescription:
      'Publishing a need, offering help or contributing all happen in the application. If you represent an organization, write to us.',
    ctaApp: 'Go to the app',
    ctaContact: 'Write to us',
  },

  // Slides / deck pages
  slides: {
    exitToCatalog: 'Back to Slides',
    printPdf: 'Print to PDF',
    languageSwitch: 'Ver en español',
    external: {
      openCta: 'Open on {provider}',
      backToCatalog: 'Back to catalog',
    },
    languageNotice: 'Original deck is in {lang}',
    typeBadge: {
      native: 'Native',
      external: 'External',
    },
    toolbar: {
      backToCatalog: 'Back to catalog',
      switchLang: 'Switch to {lang}',
      themeToLight: 'Switch to light mode',
      themeToDark: 'Switch to dark mode',
      enterFullscreen: 'Enter fullscreen',
      exitFullscreen: 'Exit fullscreen',
    },
  },

  // Contact page
  contactPage: {
    title: 'Contact',
    subtitle: 'Let us talk',
    description:
      'Write to us if you represent an organization, want to become an ally, are press, or want to report something.',
    heroDescription:
      'This channel is for institutional conversations. If you need help or want to contribute, that happens in the application.',
    appNoticeTitle: 'Do you need help, or want to contribute?',
    appNoticeBody:
      'Publishing a need, offering help, contributing and tracking your contribution all happen in Ayuda Directa. This form does not reach anyone who can respond to an emergency.',
    appNoticeCta: 'Go to the app',
    formTitle: 'Write to us',
    nameLabel: 'Name',
    namePlaceholder: 'Your name',
    emailLabel: 'Email',
    emailPlaceholder: 'you@email.com',
    reasonLabel: 'Topic',
    reasonOptions: [
      { value: '', label: '— Select a topic —' },
      { value: 'general', label: 'General enquiry' },
      {
        value: 'organization',
        label: 'We are an organization and want to help',
      },
      { value: 'ally', label: 'Institutional partnership' },
      { value: 'press', label: 'Press' },
      { value: 'report', label: 'Report a problem with the information' },
    ],
    subjectLabel: 'Subject',
    subjectPlaceholder: 'What is it about?',
    messageLabel: 'Message',
    messagePlaceholder: 'Tell us with as much detail as you can.',
    sendButton: 'Send',
    sendingButton: 'Sending…',
    successTitle: 'Message sent',
    successMessage: 'Thank you for writing to us.',
    successNextSteps: {
      general: 'We reply within a few working days.',
      organization:
        'We will get in touch to understand what your organization can offer and how to coordinate it.',
      ally: 'We will write to discuss the partnership and next steps.',
      press: 'The team replies as soon as possible.',
      report:
        'We will review what you reported. If it is urgent and affects someone, please also report it in the application.',
    },
    sendAnotherButton: 'Send another message',
    requiredField: 'This field is required',
    invalidEmail: 'Enter a valid email address',
    submitError: 'We could not send the message. Please try again.',
    fallbackMessage:
      'If the form does not work, reach us through the public channels.',
    formNote:
      'We only use these details to reply to you. We do not publish or share them.',
    quickLinksTitle: 'You might be looking for',
    quickLinks: [
      {
        label: 'How it works',
        href: '/how-it-works',
        description: 'The whole path, from a need to the evidence.',
      },
      {
        label: 'Transparency',
        href: '/transparency',
        description: 'How much came in and how much was used with evidence.',
      },
      {
        label: 'Developers',
        href: '/developers',
        description: 'Public API, OpenAPI and MCP to integrate.',
      },
    ],
  },

  contributorsPage: {
    title: 'Contributors',
    description:
      'The people building Corag: engineering, design, product, content and coordination.',
    eyebrow: 'The team',
    intro: (count: number) =>
      `Corag is built by ${count} people donating their time. These are they.`,
    sinceLabel: (year: number) => `Since ${year}`,
    currentTitle: 'Building it today',
    currentIntro:
      'Everyone contributes from their own area. The work is voluntary and the credit is shared.',
    pastTitle: 'Who built it before',
    pastIntro:
      'Time someone donated does not stop counting when they stop being active.',
    joinLabel: 'I want to contribute',
    contributeLabel: 'How to contribute',
    emptyTitle: 'No contributors published yet',
    emptyDesc:
      'We are putting the directory together. If you built part of Corag and are missing, write to us.',
  },

  conductForm: {
    formEyebrow: 'Confidential report',
    formSectionTitle: 'Report a Code of Conduct concern',
    privacyNote:
      'Reports go to organizers only. They are not listed publicly and are not posted to community Slack channels. You may submit anonymously.',
    incidentLabel: 'What happened?',
    incidentPlaceholder:
      'Describe the incident with as much context as you are comfortable sharing…',
    whenLabel: 'When did it happen? (optional)',
    whenPlaceholder: 'Date, time, or event name…',
    peopleLabel: 'People involved (optional)',
    peoplePlaceholder: 'Names or roles, if known…',
    anonymousLabel: 'Submit anonymously',
    anonymousHint:
      'If you choose anonymity, we will not store a reporter name or email with this report.',
    nameLabel: 'Your name (optional if anonymous)',
    emailLabel: 'Your email (required unless anonymous)',
    followupLabel: 'Preferred follow-up (optional)',
    followupPlaceholder: 'Email, call, or “no follow-up needed”…',
    submitButton: 'Submit confidential report',
    successTitle: 'Report received',
    successMessage:
      'Thank you. Organizers will review this confidentially and act as quickly and fairly as possible.',
  },

  contactSection: {
    title: 'Do you represent an organization?',
    description:
      'Foundations, companies, municipalities and community organizations can join the network. Write to us and we will coordinate.',
    ctaText: 'Write to us',
    ctaLink: '/contact',
  },

  // Search input
  searchPlaceholder: 'Search articles...',
  searchHint: 'Tip: press Esc to clear the search.',
  clearSearch: 'Clear',
  resultsFound: (count) => `${count} result${count !== 1 ? 's' : ''} found`,

  // Loading states
  loadingIndex: 'Loading search index...',
  searching: 'Searching articles...',

  // Results
  noResults: (query) => `No articles found matching "${query}"`,
  noResultsSuggestion: 'Try a broader keyword or browse all posts.',
  noPostsAvailable: 'No posts available yet.',

  // Pagination
  previous: 'Previous',
  next: 'Next',
  pageOf: (current, total) => `Page ${current} of ${total}`,

  // Blog header
  blogTitle: 'Blog',
  blogHeading: 'Articles & Stories',
  blogDescription:
    'Articles on humanitarian coordination, transparency, civic technology, and how you build an aid network people can verify.',
  allPosts: 'All Posts',
  showingArticles: (showing, total) =>
    `Showing ${showing} of ${total} articles`,
  articlesAvailable: (total) =>
    `${total} article${total !== 1 ? 's' : ''} available`,
  lastUpdatedOn: 'Updated',
  readingTime: (minutes) => `${minutes} min read`,
  relatedArticles: 'Related Articles',
  relatedArticlesDescription: 'You might also enjoy these posts',

  // Series navigation
  seriesPartOf: 'Part of the series',
  seriesChapter: (n) => `Chapter ${n}`,
  seriesPrevious: 'Previous chapter',
  seriesNext: 'Next chapter',
  seriesToC: 'All chapters',
  seriesChapterOf: (current, total) => `Chapter ${current} of ${total}`,

  // Series pages
  seriesPage: {
    title: 'Series',
    breadcrumb: 'Series',
    chapters: 'chapters',
    chapter: 'Chapter',
    progress: (current, total) => `${current} of ${total} chapters`,
    readChapter: 'Read chapter',
    emptyState: 'No posts in this series yet.',
    backToSeries: 'All Series',
    backToBlog: 'Back to Blog',
    startReading: 'Start reading',
    continueReading: 'Continue reading',
  },
  seriesListingPage: {
    title: 'Blog Series',
    description:
      'Multi-chapter article collections — long reads on the model, the field, and the technology behind Corag.',
    heading: 'Series',
    postsCount: (count) => `${count} ${count === 1 ? 'chapter' : 'chapters'}`,
    exploreSeries: 'Explore series',
    emptyState: 'No series published yet.',
  },

  // Scheduled posts (dev-only indicators)
  scheduledBadge: 'Scheduled',
  scheduledBannerTitle: 'Scheduled post',
  scheduledBannerMessage: (date) =>
    `This post will be published on ${date}. It is only visible in development mode.`,

  // Draft posts (dev + preview indicators)
  draftBadge: 'Draft',
  draftBannerTitle: 'Draft post',
  draftBannerMessage:
    'This post is a work in progress. It is visible here because you are on the dev server or a preview branch — it will not ship to production until the draft flag is removed.',

  // Tags
  postsTagged: (tag) => `Posts tagged "${tag}"`,
  allTags: 'All Tags',
  tagNames: {
    // Primary tags
    tech: 'Tech',
    talks: 'Talks',
    community: 'Community',
    keynote: 'Keynote',
    workshop: 'Workshop',
    'lightning-talk': 'Lightning Talk',
    // Secondary tags (topics)
    'web-development': 'Web Development',
    javascript: 'JavaScript',
    ai: 'AI & ML',
    blockchain: 'Blockchain',
    devops: 'DevOps',
    python: 'Python',
    university: 'University',
    database: 'Databases',
    iot: 'IoT',
    design: 'Design',
    mobile: 'Mobile',
    'ai-agents': 'AI Agents',
    // Subtopic tags
    astro: 'Astro',
    svelte: 'Svelte',
    cloudflare: 'Cloudflare',
    docker: 'Docker',
    graphql: 'GraphQL',
    django: 'Django',
    kotlin: 'Kotlin',
    claude: 'Claude',
    mcp: 'MCP',
    flutter: 'Flutter',
  },
  tagDescriptions: {
    // Primary tags
    tech: 'Tutorials, guides, and technical articles from the community.',
    talks: 'Tech talks, slides, videos, and events.',
    community:
      'Community-focused articles — governance, collaboration, and how the network organizes itself.',
    keynote: 'Talks and presentations about the Corag model.',
    workshop:
      'Hands-on workshops — practical, multi-hour sessions with code, exercises, and step-by-step guidance.',
    'lightning-talk':
      'Lightning talks — short 5–10 minute presentations that pack a single sharp idea.',
    // Secondary tags (topics)
    'web-development':
      'Frameworks, frontend, fullstack — Astro, Svelte, Vue, Meteor, CSS, Webpack.',
    javascript:
      'JavaScript ecosystem — Vue.js, Webpack, Meteor, A-Frame, Node.',
    ai: 'Artificial intelligence, machine learning, deep learning, and LLMs.',
    blockchain:
      'Blockchain, cryptocurrency, Bitcoin, Ethereum, and smart contracts.',
    devops: 'Docker, containers, serverless, microservices, and deployment.',
    python: 'Python ecosystem — Django, TensorFlow, MyPy, Spark.',
    university: 'Academic coursework, research, and student projects.',
    database: 'SQL, NoSQL, MongoDB, and multi-database architecture.',
    iot: 'Internet of Things, sensors, hardware, and voice interfaces.',
    design: 'Visual design, branding, web design, and UX.',
    mobile:
      'Mobile development — Android, iOS, cross-platform frameworks, and the journey of learning to ship for handhelds.',
    'ai-agents':
      'AI agents and the agentic web — autonomous systems, tool use, orchestration patterns, MCP, and the .well-known agent standards.',
    // Subtopic tags
    astro:
      'Astro framework — islands architecture, Content Collections, MDX, and static-site builds.',
    svelte:
      'Svelte and SvelteKit — reactive components, runes, and hydration patterns.',
    cloudflare: 'Cloudflare Pages, Workers, R2, and the agentic-web platform.',
    docker:
      'Docker containers, Dockerfile authoring, and multi-service orchestration.',
    graphql:
      'GraphQL APIs — schemas, resolvers, federation, and client patterns.',
    django:
      'Django framework — ORM, multi-database setups, admin, and deployment.',
    kotlin:
      'Kotlin language and ecosystem — Kotlin Multiplatform, Compose Multiplatform, Android, JVM tooling.',
    claude:
      "Claude — Anthropic's model family and the agent runtimes built on top (Claude Code, Skills, Files API).",
    mcp: 'Model Context Protocol — standardized agent↔tool communication, server cards, and the agentic-web standards layer.',
    flutter:
      'Flutter — Dart-based cross-platform mobile framework, widgets, and the trade-offs versus native and Kotlin Multiplatform.',
  },

  // Series names and descriptions (keyed by series slug). Empty during the v3.0.0 transition.
  seriesNames: {},
  seriesDescriptions: {},

  // Date formatting
  dateLocale: 'en-US',

  // Read more
  readMore: 'Read more',

  // Scroll to timeline
  scrollToTimeline: 'View Timeline',
  viewLabel: (label: string) => `View ${label}`,

  // 404 page
  notFoundPage: {
    title: 'Page not found',
    description: 'The page you are looking for does not exist or has moved.',
    heading: 'This page does not exist',
    message:
      'The link may be broken, or the page may have moved. From here you can go back home, search the blog, or go straight to the application.',
    eyebrow: 'Error 404',
    backHome: 'Back home',
    searchBlog: 'Search the blog',
    appCta: 'Go to the app',
  },

  // Blog post engagement
  engagement: {
    // Share buttons
    shareTitle: 'Share this post',
    shareSeriesTitle: 'Share this series',
    shareOnTwitter: 'Share on X',
    shareOnLinkedIn: 'Share on LinkedIn',
    shareOnWhatsApp: 'Share on WhatsApp',
    copyLink: 'Copy link',
    linkCopied: 'Link copied!',

    // Newsletter
    newsletterTitle: 'Stay in the loop',
    newsletterDescription:
      'Get notified when the community publishes new articles, recaps, and event announcements. No spam, unsubscribe anytime.',
    newsletterPlaceholder: 'your@email.com',
    newsletterButton: 'Subscribe',
    newsletterSubmitting: 'Subscribing...',
    newsletterSuccessTitle: 'You\u2019re subscribed!',
    newsletterSuccessMessage:
      'Thanks for subscribing. You\u2019ll hear from us when something new is published.',
    newsletterInvalidEmail: 'Please enter a valid email address.',
    newsletterAlreadySubscribed:
      'You\u2019re already subscribed. Thanks for being here!',
    newsletterResubscribe: 'Subscribe with a different email',
    newsletterPrivacy: 'No spam. Unsubscribe anytime.',

    // End-of-post CTA
    ctaTitle: 'Enjoyed this post?',
    ctaDescription:
      'Share it with your network or subscribe to get the latest community articles in your inbox.',
  },

  // Blog engagement (author + share)
  blogEngagement: {
    aboutAuthor: 'About the author',
    writtenBy: 'Written by',
  },

  // Errors
  searchError: 'An error occurred while searching. Please try again.',
  loadError: 'Failed to load search index. Please refresh the page.',
  retry: 'Try again',
};
