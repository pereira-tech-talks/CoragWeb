/**
 * Spanish translations
 */

import type { SiteTranslations } from './types';

export const es: SiteTranslations = {
  // Site metadata
  home: {
    eyebrow: 'El ecosistema de impacto social',
    title: 'Tenemos coraje para servir y transformar vidas',
    lead: 'Conectamos a quienes quieren ayudar con quienes más lo necesitan, para que la ayuda sea transparente, medible y constante.',
    ctaPrimary: 'Quiero ayudar',
    ctaSecondary: 'Cómo funciona',

    problemEyebrow: 'El problema',
    problemTitle: 'La intención existe. La conexión falla.',
    problemBody:
      'Muchas personas quieren donar o vincularse a una causa, pero no encuentran cómo hacerlo de manera confiable, cercana y significativa. No falta generosidad — falta conexión. La ayuda termina repartida en lugares que no se hablan entre sí.',
    problemFragments: [
      'Cadenas de WhatsApp',
      'Formularios sueltos',
      'Hojas de cálculo',
      'Llamadas',
      'Publicaciones que se pierden',
      'Listas que nadie actualiza',
    ],

    howEyebrow: 'Cómo funciona',
    howTitle: 'Un puente entre quien necesita y quien puede',
    howBody:
      'Una necesidad se publica, se ubica y se clasifica. Alguien que puede ayudar la encuentra. Se coordina, se entrega, y queda registro de lo que pasó.',
    howSteps: [
      {
        title: 'Se publica',
        body: 'Una persona o comunidad describe qué necesita, dónde y con qué urgencia.',
      },
      {
        title: 'Se encuentra',
        body: 'Quien puede ayudar la ve en el mapa, filtrada por cercanía y por tipo de ayuda.',
      },
      {
        title: 'Se coordina',
        body: 'Un responsable con nombre organiza la entrega, muchas veces dentro de un frente de trabajo.',
      },
      {
        title: 'Queda la evidencia',
        body: 'Se sube el soporte, se revisa, y solo entonces se publica.',
      },
    ],
    howCta: 'Ver el recorrido completo',

    trustEyebrow: 'Transparencia',
    trustTitle:
      'Decir que somos transparentes es fácil. Publicar la cuenta requiere coraje.',
    trustBody:
      'Por eso cada aporte tiene un responsable con nombre y cada peso tiene un destino que puedes revisar. Publicamos dos números distintos, y los dos son públicos.',
    pillars: [
      {
        title: 'Recibido',
        body: 'Cuánto entró. Es el número fácil de mostrar, y por sí solo no dice nada.',
      },
      {
        title: 'Usado con evidencia',
        body: 'Cuánto se gastó con soporte verificado: recibos, fotos, resultados. Este es el número que importa.',
      },
      {
        title: 'Transferencia directa',
        body: 'El dinero va a cuentas de responsables verificados, no a una tesorería central. Cada aporte es atribuible.',
      },
    ],
    trustCta: 'Cómo funciona la trazabilidad',

    productEyebrow: 'Producto insignia',
    productTitle: 'Ayuda Directa',
    productBody:
      'Publicar una necesidad, ofrecer ayuda, aportar y seguir tu aporte ocurre en la aplicación. Allí viven el mapa, los frentes de trabajo, los responsables y la evidencia.',
    productCta: 'Únete al movimiento',
    productPhotoAlt:
      'Dos voluntarias entregan un paquete de mercado a un hombre en una vereda',

    devEyebrow: 'Interoperabilidad',
    devTitle: 'Muchas interfaces, una sola red de datos',
    devBody:
      'En una emergencia aparecen varias aplicaciones al tiempo, cada una con su propia base de datos de necesidades. El resultado es más fragmentación, no menos. Por eso publicamos una API abierta: para que una aplicación nueva sea un cliente de la misma red, no otro silo.',
    devCta: 'Documentación para desarrolladores',

    closingTitle: '¿Te sumas?',
    closingBody:
      'Si quieres ayudar, aportar o publicar una necesidad, eso ocurre en la aplicación. Si construyes software, quieres ser aliado o quieres colaborar con el equipo, empieza por aquí.',
    closingCtaApp: 'Ir a la aplicación',
    closingCtaTeam: 'Quiero colaborar',
  },
  siteTitle: 'Corag',
  siteTitleFull: 'Corag — El ecosistema de impacto social',
  siteDescription:
    'Conectamos a quienes quieren ayudar con quienes más lo necesitan, para que la ayuda sea transparente, medible y constante.',

  // Navigation
  nav: {
    app: 'Ir a la aplicación',
    home: 'Inicio',
    blog: 'Blog',
    about: 'Sobre Corag',
    contact: 'Contacto',
    community: 'Comunidad',
    contributors: 'Colaboradores',
    channels: 'Canales',
    menu: 'Menú',
    closeMenu: 'Cerrar menú',
    openMenu: 'Abrir menú',
  },

  // Footer
  footer: {
    copyright: 'Corag',
    allRightsReserved: 'Todos los derechos reservados.',
    tagline: 'El ecosistema de impacto social.',
    appNote:
      'Publicar una necesidad, ofrecer ayuda, aportar y seguir tu aporte ocurre en la aplicación.',
  },

  // Homepage sections
  homeSections: {
    latestArticles: 'Del blog',
    viewAllPosts: 'Ver todos los artículos',
  },

  // Contact section (homepage)
  contact: {
    title: 'Contacto',
    nameLabel: 'Nombre',
    namePlaceholder: 'Tu nombre',
    emailLabel: 'Correo electrónico',
    emailPlaceholder: 'tu@correo.com',
    messageLabel: 'Mensaje',
    messagePlaceholder: 'Escribe tu mensaje...',
    sendButton: 'Enviar mensaje',
  },

  // About page

  aboutPage: {
    title: 'Sobre Corag',
    subtitle: 'El ecosistema de impacto social',
    description:
      'Qué es Corag, de dónde viene el nombre, cómo funciona el modelo y por qué la evidencia está en el centro.',
    heroDescription:
      'Nacimos de un grupo de jóvenes apasionados por el servicio social. De ahí salió el propósito de crear un puente digital entre quienes quieren ayudar y quienes más lo necesitan.',
    bioTitle: 'Tenemos coraje para servir y transformar vidas',
    bioText:
      'El nombre viene de <strong>coraje</strong>. El corazón que reemplaza la <em>o</em> lleva el <strong>amor</strong>. Nuestro logo transmite coraje, innovación y amor.<br /><br />Coraje no es bravuconería. Es aparecer cuando es incómodo, poner tu nombre en una entrega y publicar la cuenta después. Esa última parte es la que conecta la idea con el producto: los responsables, la transferencia directa y la evidencia moderada son el coraje vuelto mecanismo. Decir que somos transparentes es fácil; publicar el recibo requiere coraje.<br /><br />Corag surge al reconocer una realidad simple: muchas personas quieren donar o vincularse a una causa, pero no encuentran cómo hacerlo de manera confiable, cercana y significativa. No falta generosidad — falta conexión.',
    passionsTitle: 'Nuestros valores',
    passions: [
      {
        title: 'Colaboración',
        description:
          'Unimos gobiernos, organizaciones, empresas y personas en una sola red, en lugar de multiplicar sistemas aislados.',
        icon: 'users',
        link: '/como-funciona',
      },
      {
        title: 'Empatía',
        description:
          'Quien recibe ayuda es un vecino, no el telón de fondo de la virtud de alguien más.',
        icon: 'heart',
        link: '/como-funciona',
      },
      {
        title: 'Confianza',
        description:
          'Cada aporte tiene un responsable con nombre y un destino que puedes revisar.',
        icon: 'shield',
        link: '/transparencia',
      },
      {
        title: 'Amor',
        description:
          'Está en el corazón del logo y en la razón por la que existe esto.',
        icon: 'heart',
        link: '/sobre-corag',
      },
      {
        title: 'Innovación social',
        description:
          'Una API pública, una especificación OpenAPI y un servidor MCP para que otros construyan sobre la misma red.',
        icon: 'sparkles',
        link: '/desarrolladores',
      },
      {
        title: 'Transparencia',
        description:
          'Publicamos cuánto se recibió y cuánto se usó con evidencia. Son dos números distintos y los dos son públicos.',
        icon: 'eye',
        link: '/transparencia',
      },
    ],
    quickFactsTitle: 'En resumen',
    quickFacts: [
      'Corag es el ecosistema; Ayuda Directa es el producto insignia',
      'La coordinación, los aportes y la evidencia ocurren en la aplicación',
      'El dinero va por transferencia directa a responsables verificados',
      'La evidencia se modera antes de publicarse',
      'API pública, OpenAPI 3.1 y servidor MCP abiertos a quien quiera integrarse',
    ],
    ctaTitle: '¿Quieres ser parte?',
    ctaDescription:
      'Publicar una necesidad, ofrecer ayuda o aportar ocurre en la aplicación. Si representas una organización, escríbenos.',
    ctaApp: 'Ir a la aplicación',
    ctaContact: 'Escríbenos',
  },

  // Slides / deck pages
  slides: {
    exitToCatalog: 'Volver a Slides',
    printPdf: 'Imprimir como PDF',
    languageSwitch: 'View in English',
    external: {
      openCta: 'Abrir en {provider}',
      backToCatalog: 'Volver al catálogo',
    },
    languageNotice: 'El deck original está en {lang}',
    typeBadge: {
      native: 'Nativo',
      external: 'Externo',
    },
    toolbar: {
      backToCatalog: 'Volver al catálogo',
      switchLang: 'Cambiar a {lang}',
      themeToLight: 'Cambiar a modo claro',
      themeToDark: 'Cambiar a modo oscuro',
      enterFullscreen: 'Entrar en pantalla completa',
      exitFullscreen: 'Salir de pantalla completa',
    },
  },

  // Contact page
  contactPage: {
    title: 'Contacto',
    subtitle: 'Hablemos',
    description:
      'Escríbenos si representas una organización, quieres ser aliado, eres prensa o quieres reportar algo.',
    heroDescription:
      'Este canal es para conversaciones institucionales. Si necesitas ayuda o quieres aportar, eso ocurre en la aplicación.',
    appNoticeTitle: '¿Necesitas ayuda o quieres aportar?',
    appNoticeBody:
      'Publicar una necesidad, ofrecer ayuda, aportar y seguir tu aporte ocurre en Ayuda Directa. Este formulario no llega a nadie que pueda atender una emergencia.',
    appNoticeCta: 'Ir a la aplicación',
    formTitle: 'Escríbenos',
    nameLabel: 'Nombre',
    namePlaceholder: 'Tu nombre',
    emailLabel: 'Correo',
    emailPlaceholder: 'tu@correo.com',
    reasonLabel: 'Tema',
    reasonOptions: [
      { value: '', label: '— Selecciona un tema —' },
      { value: 'general', label: 'Contacto general' },
      {
        value: 'organization',
        label: 'Soy una organización y quiero ayudar',
      },
      { value: 'ally', label: 'Alianza institucional' },
      { value: 'press', label: 'Prensa' },
      { value: 'report', label: 'Reportar un problema con la información' },
    ],
    subjectLabel: 'Asunto',
    subjectPlaceholder: '¿De qué se trata?',
    messageLabel: 'Mensaje',
    messagePlaceholder: 'Cuéntanos con el detalle que puedas.',
    sendButton: 'Enviar',
    sendingButton: 'Enviando…',
    successTitle: 'Mensaje enviado',
    successMessage: 'Gracias por escribirnos.',
    successNextSteps: {
      general: 'Te respondemos en pocos días hábiles.',
      organization:
        'Te contactamos para entender qué puede aportar tu organización y cómo coordinarlo.',
      ally: 'Te escribimos para hablar de la alianza y los siguientes pasos.',
      press: 'El equipo responde lo antes posible.',
      report:
        'Revisamos lo que nos reportas. Si es urgente y afecta a alguien, escríbelo también en la aplicación.',
    },
    sendAnotherButton: 'Enviar otro mensaje',
    requiredField: 'Este campo es obligatorio',
    invalidEmail: 'Escribe un correo válido',
    submitError: 'No pudimos enviar el mensaje. Inténtalo de nuevo.',
    fallbackMessage:
      'Si el formulario no funciona, escríbenos por los canales públicos.',
    formNote:
      'Solo usamos estos datos para responderte. No los publicamos ni los compartimos.',
    quickLinksTitle: 'Quizá buscabas',
    quickLinks: [
      {
        label: 'Cómo funciona',
        href: '/como-funciona',
        description: 'El recorrido completo, de la necesidad a la evidencia.',
      },
      {
        label: 'Transparencia',
        href: '/transparencia',
        description: 'Cuánto se recibió y cuánto se usó con evidencia.',
      },
      {
        label: 'Desarrolladores',
        href: '/desarrolladores',
        description: 'API pública, OpenAPI y MCP para integrarte.',
      },
    ],
  },

  contributorsPage: {
    title: 'Colaboradores',
    description:
      'Las personas que construyen Corag: desarrollo, diseño, producto, contenido y coordinación.',
    eyebrow: 'El equipo',
    intro: (count: number) =>
      `Corag lo construyen ${count} personas que donan su tiempo. Estas son.`,
    sinceLabel: (year: number) => `Desde ${year}`,
    currentTitle: 'Quienes están construyendo hoy',
    currentIntro:
      'Cada quien aporta desde su área. El trabajo es voluntario y el crédito es de todas y todos.',
    pastTitle: 'Quienes construyeron antes',
    pastIntro:
      'El tiempo que alguien donó no deja de contar cuando deja de estar activa o activo.',
    joinLabel: 'Quiero colaborar',
    contributeLabel: 'Cómo contribuir',
    emptyTitle: 'Aún no hay colaboradores publicados',
    emptyDesc:
      'Estamos armando el directorio. Si construiste algo de Corag y no apareces, escríbenos.',
  },

  conductForm: {
    formEyebrow: 'Reporte confidencial',
    formSectionTitle: 'Reportar una preocupación del Código de Conducta',
    privacyNote:
      'Los reportes llegan solo a organizadores. No se listan en público ni se publican en canales de Slack de la comunidad. Puedes enviar de forma anónima.',
    incidentLabel: '¿Qué ocurrió?',
    incidentPlaceholder:
      'Describe el incidente con el contexto que te sientas cómoda o cómodo compartiendo…',
    whenLabel: '¿Cuándo ocurrió? (opcional)',
    whenPlaceholder: 'Fecha, hora o nombre del evento…',
    peopleLabel: 'Personas involucradas (opcional)',
    peoplePlaceholder: 'Nombres o roles, si los conoces…',
    anonymousLabel: 'Enviar de forma anónima',
    anonymousHint:
      'Si eliges anonimato, no guardaremos nombre ni correo de quien reporta con este envío.',
    nameLabel: 'Tu nombre (opcional si es anónimo)',
    emailLabel: 'Tu correo (obligatorio salvo anonimato)',
    followupLabel: 'Seguimiento preferido (opcional)',
    followupPlaceholder: 'Correo, llamada o “no necesito seguimiento”…',
    submitButton: 'Enviar reporte confidencial',
    successTitle: 'Reporte recibido',
    successMessage:
      'Gracias. Los organizadores lo revisarán de forma confidencial y actuarán con prontitud y justicia.',
  },

  contactSection: {
    title: '¿Representas una organización?',
    description:
      'Fundaciones, empresas, alcaldías y organizaciones comunitarias pueden sumarse a la red. Escríbenos y coordinamos.',
    ctaText: 'Escríbenos',
    ctaLink: '/contact',
  },

  // Search input
  searchPlaceholder: 'Buscar artículos...',
  searchHint: 'Tip: presiona Esc para limpiar la búsqueda.',
  clearSearch: 'Limpiar',
  resultsFound: (count) =>
    `${count} resultado${count !== 1 ? 's' : ''} encontrado${count !== 1 ? 's' : ''}`,

  // Loading states
  loadingIndex: 'Cargando índice de búsqueda...',
  searching: 'Buscando artículos...',

  // Results
  noResults: (query) =>
    `No se encontraron artículos que coincidan con "${query}"`,
  noResultsSuggestion:
    'Prueba con una palabra clave más amplia o explora todos los artículos.',
  noPostsAvailable: 'Aún no hay artículos disponibles.',

  // Pagination
  previous: 'Anterior',
  next: 'Siguiente',
  pageOf: (current, total) => `Página ${current} de ${total}`,

  // Blog header
  blogTitle: 'Blog',
  blogHeading: 'Artículos e historias',
  blogDescription:
    'Artículos sobre coordinación humanitaria, transparencia, tecnología cívica y cómo se construye una red de ayuda que se puede verificar.',
  allPosts: 'Todos los artículos',
  showingArticles: (showing, total) =>
    `Mostrando ${showing} de ${total} artículos`,
  articlesAvailable: (total) =>
    `${total} artículo${total !== 1 ? 's' : ''} disponible${total !== 1 ? 's' : ''}`,
  lastUpdatedOn: 'Actualizado',
  readingTime: (minutes) => `${minutes} min de lectura`,
  relatedArticles: 'Artículos relacionados',
  relatedArticlesDescription: 'Estos artículos también podrían interesarte',

  // Series navigation
  seriesPartOf: 'Parte de la serie',
  seriesChapter: (n) => `Capítulo ${n}`,
  seriesPrevious: 'Capítulo anterior',
  seriesNext: 'Siguiente capítulo',
  seriesToC: 'Todos los capítulos',
  seriesChapterOf: (current, total) => `Capítulo ${current} de ${total}`,

  // Series pages
  seriesPage: {
    title: 'Series',
    breadcrumb: 'Series',
    chapters: 'capítulos',
    chapter: 'Capítulo',
    progress: (current, total) => `${current} de ${total} capítulos`,
    readChapter: 'Leer capítulo',
    emptyState: 'Aún no hay artículos en esta serie.',
    backToSeries: 'Todas las series',
    backToBlog: 'Volver al blog',
    startReading: 'Comenzar a leer',
    continueReading: 'Continuar leyendo',
  },
  seriesListingPage: {
    title: 'Series del blog',
    description:
      'Colecciones de artículos en varios capítulos — recorridos largos sobre el modelo, el terreno y la tecnología detrás de Corag.',
    heading: 'Series',
    postsCount: (count) => `${count} ${count === 1 ? 'capítulo' : 'capítulos'}`,
    exploreSeries: 'Explorar series',
    emptyState: 'Aún no hay series publicadas.',
  },

  // Scheduled posts (dev-only indicators)
  scheduledBadge: 'Programado',
  scheduledBannerTitle: 'Artículo programado',
  scheduledBannerMessage: (date) =>
    `Este artículo se publicará el ${date}. Solo es visible en modo de desarrollo.`,

  // Draft posts (dev + preview indicators)
  draftBadge: 'Borrador',
  draftBannerTitle: 'Artículo en borrador',
  draftBannerMessage:
    'Este artículo está en construcción. Es visible aquí porque estás en el servidor de desarrollo o en una rama de previsualización; no se publicará hasta que se elimine la marca de borrador.',

  // Tags
  postsTagged: (tag) => `Artículos etiquetados con "${tag}"`,
  allTags: 'Todas las etiquetas',
  tagNames: {
    // Primary tags
    tech: 'Tecnología',
    talks: 'Charlas',
    community: 'Comunidad',
    keynote: 'Keynote',
    workshop: 'Taller',
    'lightning-talk': 'Lightning Talk',
    // Secondary tags (topics)
    'web-development': 'Desarrollo Web',
    javascript: 'JavaScript',
    ai: 'IA y ML',
    blockchain: 'Blockchain',
    devops: 'DevOps',
    python: 'Python',
    university: 'Universidad',
    database: 'Bases de Datos',
    iot: 'IoT',
    design: 'Diseño',
    mobile: 'Móvil',
    'ai-agents': 'Agentes de IA',
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
    tech: 'Tutoriales, guías y artículos técnicos de la comunidad.',
    talks: 'Charlas, slides, videos y eventos.',
    community:
      'Artículos sobre la comunidad — gobernanza, colaboración y cómo se organiza la red.',
    keynote: 'Presentaciones y charlas sobre el modelo de Corag.',
    workshop:
      'Talleres prácticos — sesiones de varias horas con código, ejercicios y guía paso a paso.',
    'lightning-talk':
      'Lightning talks — presentaciones cortas de 5 a 10 minutos con una idea contundente.',
    // Secondary tags (topics)
    'web-development':
      'Frameworks, frontend, fullstack — Astro, Svelte, Vue, Meteor, CSS, Webpack.',
    javascript:
      'Ecosistema JavaScript — Vue.js, Webpack, Meteor, A-Frame, Node.',
    ai: 'Inteligencia artificial, machine learning, deep learning y LLMs.',
    blockchain:
      'Blockchain, criptomonedas, Bitcoin, Ethereum y contratos inteligentes.',
    devops: 'Docker, contenedores, serverless, microservicios y despliegue.',
    python: 'Ecosistema Python — Django, TensorFlow, MyPy, Spark.',
    university: 'Trabajos académicos, investigación y proyectos estudiantiles.',
    database: 'SQL, NoSQL, MongoDB y arquitectura multi-base de datos.',
    iot: 'Internet de las cosas, sensores, hardware e interfaces de voz.',
    design: 'Diseño visual, branding, diseño web y UX.',
    mobile:
      'Desarrollo móvil — Android, iOS, frameworks multiplataforma y el camino de aprender a publicar para dispositivos móviles.',
    'ai-agents':
      'Agentes de IA y la web agéntica — sistemas autónomos, uso de herramientas, patrones de orquestación, MCP y los estándares .well-known para agentes.',
    // Subtopic tags
    astro:
      'Framework Astro — arquitectura de islas, Content Collections, MDX y builds estáticos.',
    svelte:
      'Svelte y SvelteKit — componentes reactivos, runes y patrones de hidratación.',
    cloudflare:
      'Cloudflare Pages, Workers, R2 y la plataforma de la web agéntica.',
    docker:
      'Contenedores Docker, autoría de Dockerfiles y orquestación de múltiples servicios.',
    graphql:
      'APIs GraphQL — esquemas, resolvers, federación y patrones de cliente.',
    django:
      'Framework Django — ORM, configuraciones multi-base, admin y despliegue.',
    kotlin:
      'Lenguaje y ecosistema Kotlin — Kotlin Multiplatform, Compose Multiplatform, Android, herramientas para JVM.',
    claude:
      'Claude — la familia de modelos de Anthropic y los runtimes de agentes construidos sobre ellos (Claude Code, Skills, Files API).',
    mcp: 'Model Context Protocol — comunicación estandarizada agente↔herramienta, tarjetas de servidor y la capa de estándares de la web agéntica.',
    flutter:
      'Flutter — framework móvil multiplataforma basado en Dart, widgets y los trade-offs frente a nativo y Kotlin Multiplatform.',
  },

  // Series names and descriptions (keyed by series slug). Vacío durante la transición a v3.0.0.
  seriesNames: {},
  seriesDescriptions: {},

  // Date formatting
  dateLocale: 'es-ES',

  // Read more
  readMore: 'Leer más',

  // Scroll to timeline
  scrollToTimeline: 'Ver línea de tiempo',
  viewLabel: (label: string) => `Ver ${label}`,

  // 404 page
  notFoundPage: {
    title: 'Página no encontrada',
    description: 'La página que buscas no existe o cambió de dirección.',
    heading: 'Esta página no existe',
    message:
      'Puede que el enlace esté roto o que la página haya cambiado de lugar. Desde aquí puedes volver al inicio, buscar en el blog, o ir directo a la aplicación.',
    eyebrow: 'Error 404',
    backHome: 'Volver al inicio',
    searchBlog: 'Buscar en el blog',
    appCta: 'Ir a la aplicación',
  },

  // Blog post engagement
  engagement: {
    // Share buttons
    shareTitle: 'Compartir este artículo',
    shareSeriesTitle: 'Compartir esta serie',
    shareOnTwitter: 'Compartir en X',
    shareOnLinkedIn: 'Compartir en LinkedIn',
    shareOnWhatsApp: 'Compartir en WhatsApp',
    copyLink: 'Copiar enlace',
    linkCopied: '¡Enlace copiado!',

    // Newsletter
    newsletterTitle: 'Mantente al tanto',
    newsletterDescription:
      'Te avisaremos cuando la comunidad publique nuevos artículos, recapitulaciones o anuncios de eventos. Sin spam, puedes cancelar tu suscripción cuando quieras.',
    newsletterPlaceholder: 'tu@correo.com',
    newsletterButton: 'Suscribirme',
    newsletterSubmitting: 'Suscribiendo...',
    newsletterSuccessTitle: '¡Estás suscrito!',
    newsletterSuccessMessage:
      'Gracias por suscribirte. Sabrás de nosotros cuando publiquemos algo nuevo.',
    newsletterInvalidEmail: 'Por favor ingresa un correo electrónico válido.',
    newsletterAlreadySubscribed: 'Ya estás suscrito. ¡Gracias por estar aquí!',
    newsletterResubscribe: 'Suscribirme con otro correo',
    newsletterPrivacy: 'Sin spam. Puedes darte de baja en cualquier momento.',

    // End-of-post CTA
    ctaTitle: '¿Te gustó este artículo?',
    ctaDescription:
      'Compártelo con tu red o suscríbete para recibir los últimos artículos de la comunidad en tu correo.',
  },

  // Blog engagement (author + share)
  blogEngagement: {
    aboutAuthor: 'Sobre el autor',
    writtenBy: 'Escrito por',
  },

  // Errors
  searchError: 'Ocurrió un error al buscar. Por favor, inténtalo de nuevo.',
  loadError:
    'No se pudo cargar el índice de búsqueda. Por favor, recarga la página.',
  retry: 'Reintentar',
};
