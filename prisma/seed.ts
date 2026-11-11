import { PrismaClient } from '@prisma/client';

/**
 * Idempotently seeds the database with Evgeny Morozov's professional profile,
 * skills, work experience, projects, and social contacts.
 *
 * Uses transactional upsert to safely execute on startup without duplicating data.
 *
 * @param client PrismaClient instance managed by caller (NestJS or CLI script)
 */
export async function seedDatabase(client: PrismaClient): Promise<void> {
  await client.$transaction(async (tx) => {
    // Upsert the root profile by slug
    const profile = await tx.profile.upsert({
      where: { slug: 'main' },
      update: {
        name: 'Морозов Евгений Евгеньевич',
        title: 'Senior Frontend Developer (React, TypeScript)',
        location: 'Россия, Санкт-Петербург',
        description:
          '12+ лет профильного опыта в разработке сложных высоконагруженных веб-приложений (SPA, PWA) на React и TypeScript. ' +
          'Продуктовая разработка и UI: создание сложных клиентских интерфейсов, проектирование и развитие компонентных дизайн-систем (UI-Kit), управление состоянием (MobX, Redux), оптимизация рендеринга и метрик Core Web Vitals. ' +
          'Архитектура и масштабирование: проектирование микрофронтенд-архитектуры, реализация офлайн-режима (Service Workers, Workbox), оптимизация сборки монорепозиториев (NX, Webpack, Rollup, Vite). ' +
          'Надежность и качество кода: выстраивание процессов тестирования (Jest, RTL, E2E на Playwright, Storybook), контрактное тестирование API (Pact), статический анализ (SonarQube, Aikido). ' +
          'Техническое лидерство и DX: проведение Code Review, менторинг и онбординг инженеров, декомпозиция продуктовых задач, внедрение практик AI-assisted разработки (Windsurf, Rovo, Kiro) для ускорения Time-to-Market.',
        education:
          'ГУАП, Санкт-Петербург (2004-2010) - Высшее, Вычислительные машины, комплексы, системы и сети',
        languages: ['Русский (Родной)', 'Английский (B2)'],
      },
      create: {
        slug: 'main',
        name: 'Морозов Евгений Евгеньевич',
        title: 'Senior Frontend Developer (React, TypeScript)',
        location: 'Россия, Санкт-Петербург',
        description:
          '12+ лет профильного опыта в разработке сложных высоконагруженных веб-приложений (SPA, PWA) на React и TypeScript. ' +
          'Продуктовая разработка и UI: создание сложных клиентских интерфейсов, проектирование и развитие компонентных дизайн-систем (UI-Kit), управление состоянием (MobX, Redux), оптимизация рендеринга и метрик Core Web Vitals. ' +
          'Архитектура и масштабирование: проектирование микрофронтенд-архитектуры, реализация офлайн-режима (Service Workers, Workbox), оптимизация сборки монорепозиториев (NX, Webpack, Rollup, Vite). ' +
          'Надежность и качество кода: выстраивание процессов тестирования (Jest, RTL, E2E на Playwright, Storybook), контрактное тестирование API (Pact), статический анализ (SonarQube, Aikido). ' +
          'Техническое лидерство и DX: проведение Code Review, менторинг и онбординг инженеров, декомпозиция продуктовых задач, внедрение практик AI-assisted разработки (Windsurf, Rovo, Kiro) для ускорения Time-to-Market.',
        education:
          'ГУАП, Санкт-Петербург (2004-2010) - Высшее, Вычислительные машины, комплексы, системы и сети',
        languages: ['Русский (Родной)', 'Английский (B2)'],
      },
    });

    // Clear dependent relations to guarantee clean state upon re-seeding
    await tx.socialLink.deleteMany({ where: { profileId: profile.id } });
    await tx.skill.deleteMany({ where: { profileId: profile.id } });
    await tx.experience.deleteMany({ where: { profileId: profile.id } });
    await tx.project.deleteMany({ where: { profileId: profile.id } });

    // 1. Social & Professional Links with deterministic sort order
    const socialLinksData = [
      {
        platform: 'LinkedIn',
        url: 'https://linkedin.com/in/morozov-evgeny',
      },
      {
        platform: 'Telegram',
        url: 'https://t.me/MorozovEvgeny',
      },
      {
        platform: 'Email',
        url: 'mailto:hello@morozov-evgeny.ru',
      },
      {
        platform: 'Phone',
        url: 'tel:+79290000000',
      },
      {
        platform: 'GitHub',
        url: 'https://github.com/eemorozov',
      },
    ];

    await tx.socialLink.createMany({
      data: socialLinksData.map((link, index) => ({
        profileId: profile.id,
        platform: link.platform,
        url: link.url,
        sortOrder: index + 1,
      })),
    });

    // 2. Skills categorized and sorted
    const skillsData = [
      // Core & Frontend
      { name: 'TypeScript', category: 'Core & Frontend' },
      { name: 'JavaScript (ES6+)', category: 'Core & Frontend' },
      { name: 'React', category: 'Core & Frontend' },
      { name: 'MobX', category: 'Core & Frontend' },
      { name: 'Redux', category: 'Core & Frontend' },
      { name: 'HTML5', category: 'Core & Frontend' },
      { name: 'CSS3 / CSS-in-JS', category: 'Core & Frontend' },
      { name: 'Material UI', category: 'Core & Frontend' },
      { name: 'PWA & Service Workers (Workbox)', category: 'Core & Frontend' },
      // Architecture, Build & Performance
      { name: 'Micro-frontends', category: 'Architecture & Build' },
      { name: 'System Design', category: 'Architecture & Build' },
      { name: 'Performance Optimization (Core Web Vitals)', category: 'Architecture & Build' },
      { name: 'NX / Lerna (Monorepo)', category: 'Architecture & Build' },
      { name: 'Webpack / Vite / Rollup', category: 'Architecture & Build' },
      // Backend & API
      { name: 'Node.js', category: 'Backend & API' },
      { name: 'NestJS', category: 'Backend & API' },
      { name: 'GraphQL (Apollo)', category: 'Backend & API' },
      { name: 'Prisma ORM', category: 'Backend & API' },
      { name: 'REST API', category: 'Backend & API' },
      { name: 'WebSocket', category: 'Backend & API' },
      // Testing & Code Quality
      { name: 'Jest', category: 'Testing & Quality' },
      { name: 'Playwright (E2E)', category: 'Testing & Quality' },
      { name: 'React Testing Library', category: 'Testing & Quality' },
      { name: 'Storybook', category: 'Testing & Quality' },
      { name: 'Pact (Contract Testing)', category: 'Testing & Quality' },
      { name: 'SonarQube', category: 'Testing & Quality' },
      { name: 'Aikido', category: 'Testing & Quality' },
      { name: 'ESLint', category: 'Testing & Quality' },
      // DevOps & Tooling
      { name: 'Docker', category: 'DevOps & Tooling' },
      { name: 'CI/CD (Bitbucket Pipelines)', category: 'DevOps & Tooling' },
      { name: 'Git / Bitbucket', category: 'DevOps & Tooling' },
      { name: 'Rollbar', category: 'DevOps & Tooling' },
      { name: 'Figma', category: 'DevOps & Tooling' },
      // Leadership & AI DX
      { name: 'AI Agents (Windsurf, Rovo, Kiro)', category: 'Leadership & AI DX' },
      { name: 'Code Review & Mentoring', category: 'Leadership & AI DX' },
      { name: 'Decomposition & System Planning', category: 'Leadership & AI DX' },
      { name: 'Scrum / Agile & Hiring', category: 'Leadership & AI DX' },
    ];

    await tx.skill.createMany({
      data: skillsData.map((skill, index) => ({
        profileId: profile.id,
        name: skill.name,
        category: skill.category,
        sortOrder: index + 1,
      })),
    });

    // 3. Work Experience
    await tx.experience.createMany({
      data: [
        {
          profileId: profile.id,
          company: 'ClearOps',
          companyInfo:
            'B2B Enterprise-платформа для послепродажных цепочек поставок производителей техники на базе ИИ, с офлайн-режимом (PWA) и микрофронтендной архитектурой.',
          position: 'Senior Frontend Developer',
          period: 'Август 2018 - Сентябрь 2026',
          startDate: new Date('2018-08-01'),
          endDate: new Date('2026-09-01'),
          sortOrder: 1,
          achievements: [
            'Разрабатывал ключевые клиентские модули платформы на React, TypeScript и MobX: сложные динамические формы, интерактивные дашборды, таблицы с высокой плотностью данных.',
            'Развивал единую компонентную дизайн-систему (UI-Kit в Storybook), переиспользуемую между независимыми фронтенд-приложениями, что обеспечило консистентность UI и ускорило разработку новых экранов.',
            'Реализовал полноценный офлайн-режим (PWA на базе Workbox и Service Workers), обеспечив 100% доступность критического функционала для полевых инженеров в зонах без связи и фоновую синхронизацию данных при восстановлении сети.',
            'Спроектировал и внедрил микрофронтенд-архитектуру для изоляции независимых приложений: сократил время сборки в CI/CD с 20 до 5-7 минут и ускорил вывод фич на рынок за счет параллельной работы команд.',
            'Оптимизировал сборку монорепозитория за счет тонкой настройки NX DTE, сократив время прохождения пайплайна с 60+ до 12 минут; унифицировал деплой через shared Bitbucket pipelines (сокращение настройки с 5 до 1 минуты).',
            'Выстроил контрактное тестирование между фронтендом и бэкендом через Pact (Contract Testing), сведя к нулю регрессионные ошибки при интеграции REST API.',
            'Довел покрытие критических пользовательских сценариев тестами (Jest, Playwright, Storybook) до 85%+ и настроил статический анализ в пайплайнах (SonarQube, Aikido) и мониторинг (Rollbar), снизив долю критических багов на продакшене до 2%.',
            'Внедрил стандарты и единые правила контекста для AI-ассистентов (Windsurf, Rovo, Kiro) во фронтенд-команде, автоматизировав рутинную генерацию unit/E2E-тестов, первичного ревью и технической документации.',
            'Внедрил культуру строгого Code Review (снижение количества критических багов на этапе тестирования на 40%), проводил технический онбординг, менторинг разработчиков, собеседования и декомпозицию бизнес-задач.',
          ],
          techStack: [
            'TypeScript',
            'React',
            'MobX',
            'Rollup / Vite / Webpack',
            'NX / Lerna',
            'Playwright',
            'Jest',
            'Storybook',
            'Pact',
            'Workbox',
            'Material UI',
            'REST API',
            'WebSocket',
            'Docker',
            'Atlassian (Jira / Confluence / Bitbucket)',
            'Rollbar',
            'Aikido',
            'SonarQube',
            'AI Agents',
          ],
        },
        {
          profileId: profile.id,
          company: 'Рейтинг Букмекеров',
          companyInfo:
            'Российское спортивное СМИ и высоконагруженный интернет-портал, посвящённый ставкам на спорт, букмекерской индустрии, прогнозам и аналитике.',
          position: 'Middle Frontend Developer',
          period: 'Декабрь 2017 - Август 2018',
          startDate: new Date('2017-12-01'),
          endDate: new Date('2018-08-01'),
          sortOrder: 2,
          achievements: [
            'Разработал высоконагруженный портал (PWA) на React и Node.js с учётом строгих требований Core Web Vitals и SEO.',
            'Оптимизировал отрисовку букмекерских коэффициентов в реальном времени через WebSocket, что позволило сократить задержку интерфейса с 250 до 150 мс.',
            'Ускорил время первоначальной загрузки страниц (LCP) за счет SSR-рендеринга, code splitting, оптимизации бандла и ленивой загрузки медиа-контента с 4 секунд до 2.1 секунды.',
          ],
          techStack: [
            'React',
            'Node.js',
            'JavaScript (ES6+)',
            'PWA',
            'Webpack',
            'WebSocket',
            'REST API',
          ],
        },
        {
          profileId: profile.id,
          company: 'Braind',
          companyInfo:
            'Digital-агентство по разработке сложных сайтов и цифровых продуктов для крупных ритейлеров и производителей.',
          position: 'Frontend Web Developer',
          period: 'Июнь 2014 - Ноябрь 2017',
          startDate: new Date('2014-06-01'),
          endDate: new Date('2017-11-01'),
          sortOrder: 3,
          achievements: [
            'Разрабатывал сложные адаптивные сайты, получавшие престижные отраслевые веб-награды (Рейтинг Рунета, Золотой сайт, Awwwards, CSS Design Awards).',
            'Сайт-каталог интерьеров для Kerama Marazzi: реализовал ленивую подгрузку изображений и работу без перезагрузки страницы; среднее время на сайте превысило 3 минуты, а показатель отказов опустился ниже 15%.',
            'Интернет-магазин «Монеты»: провёл полный редизайн клиентской части, который привёл к росту конверсии в заказ на 26%.',
            'Сайт-бутик для ювелирного бренда Chekotin Jewellery: среднее время на сайте достигло 3,5 минуты, а глубина просмотра превысила 4 страницы.',
          ],
          techStack: ['JavaScript', 'HTML', 'CSS', 'Less', 'Sass', 'PHP'],
        },
        {
          profileId: profile.id,
          company: 'INTELVISION / Jeetrium',
          companyInfo:
            'INTELVISION - системный интегратор полного цикла. Jeetrium - городской стартап для поиска идей досуга.',
          position: 'Frontend Web Developer',
          period: 'Апрель 2012 - Май 2014',
          startDate: new Date('2012-04-01'),
          endDate: new Date('2014-05-01'),
          sortOrder: 4,
          achievements: [
            'Занимался разработкой интерактивных SCADA веб-интерфейсов для систем автоматизации и диспетчеризации.',
            'Создал адаптивную web-версию личного кабинета, сократив объем первоначально загружаемого JS-бандла на 30%, что ускорило запуск интерфейса на слабых мобильных устройствах на 1.2 секунды.',
            'Разрабатывал SPA веб-приложение для стартапа Jeetrium: интегрировал систему AJAX-загрузки контента и бесконечного горизонтального скролла для пользовательских историй, что повысило вовлеченность аудитории при просмотре ленты событий на 40%.',
          ],
          techStack: ['Backbone.js', 'JavaScript', 'HTML', 'CSS', 'Grunt'],
        },
      ],
    });

    // 4. Highlighted Projects
    await tx.project.createMany({
      data: [
        {
          profileId: profile.id,
          name: 'Digital Business Card GraphQL API (Текущий проект)',
          description:
            'Backend-приложение цифровой визитки специалиста на NestJS, GraphQL (Apollo Sandbox), Prisma ORM и PostgreSQL с 3-слойной архитектурой и оптимизацией N+1 запросов через DataLoader.',
          url: 'https://github.com/morozov-evgeny/digital-business-card',
          techStack: [
            'TypeScript',
            'Node.js',
            'NestJS',
            'GraphQL',
            'Prisma',
            'PostgreSQL',
            'Docker',
          ],
          sortOrder: 1,
        },
        {
          profileId: profile.id,
          name: 'ClearOps - B2B Enterprise Platform & UI-Kit',
          description:
            'Масштабируемая микрофронтенд-платформа в монорепозитории NX с полноценным офлайн-режимом (PWA / Service Workers), собственной дизайн-системой в Storybook и контрактным тестированием Pact.',
          url: 'https://linkedin.com/in/morozov-evgeny',
          techStack: [
            'React',
            'TypeScript',
            'MobX',
            'NX',
            'Workbox (PWA)',
            'Storybook',
            'Playwright',
            'Pact',
          ],
          sortOrder: 2,
        },
        {
          profileId: profile.id,
          name: 'Рейтинг Букмекеров - Highload Sports Portal (SSR & PWA)',
          description:
            'Высоконагруженный спортивный портал с обновлением коэффициентов в реальном времени по WebSocket (задержка 150 мс) и SSR-рендерингом на Node.js и React (LCP 2.1 с).',
          url: 'https://bookmaker-ratings.ru',
          techStack: ['React', 'Node.js', 'SSR', 'PWA', 'WebSocket', 'Webpack'],
          sortOrder: 3,
        },
        {
          profileId: profile.id,
          name: 'Kerama Marazzi - Интерактивный каталог интерьеров',
          description:
            'Адаптивный сайт-каталог с ленивой загрузкой контента и SPA-навигацией без перезагрузки страницы, отмеченный отраслевыми веб-наградами.',
          url: 'https://kerama-marazzi.com',
          techStack: ['JavaScript', 'HTML5', 'CSS3', 'SPA'],
          sortOrder: 4,
        },
        {
          profileId: profile.id,
          name: 'Интернет-магазин «Монеты» & Бутик Chekotin Jewellery',
          description:
            'E-commerce проекты с фокусом на продуктовые метрики и UX: рост конверсии в заказ на 26% и глубина просмотра более 4 страниц.',
          url: 'https://linkedin.com/in/morozov-evgeny',
          techStack: ['JavaScript', 'HTML5', 'Sass/Less', 'E-Commerce'],
          sortOrder: 5,
        },
      ],
    });
  });
}

// Standalone CLI execution handler (e.g. npx prisma db seed)
if (require.main === module) {
  const cliPrisma = new PrismaClient();
  seedDatabase(cliPrisma)
    .then(async () => {
      // eslint-disable-next-line no-console
      console.log('Database seeded successfully with Evgeny Morozov profile!');
      await cliPrisma.$disconnect();
    })
    .catch(async (e) => {
      // eslint-disable-next-line no-console
      console.error('Error seeding database:', e);
      await cliPrisma.$disconnect();
      process.exit(1);
    });
}
