const apiUrl = process.env.API_URL || 'http://0.0.0.0:8055';
const proxyUrl = apiUrl.endsWith('/**')
    ? apiUrl
    : apiUrl.replace(/\/$/, '') + '/**';

export default defineNuxtConfig({
    compatibilityDate: '2025-01-01',
    vite: {
        optimizeDeps: {
            include: [
                '@vue/devtools-core',
                '@vue/devtools-kit',
                'url-parse', // CJS
                'lodash', // CJS
                'base-64', // CJS
                'utf8', // CJS
                'dayjs', // CJS
                'dayjs/locale/de', // CJS
                'dayjs/locale/cs', // CJS
                'dayjs/plugin/relativeTime', // CJS
                'marked',
                'isomorphic-dompurify', // CJS
                '@directus/sdk',
                '@turf/circle',
                'vuedraggable', // CJS
                'zod'
            ]
        }
    },
    alias: {
        tslib: 'tslib/tslib.es6.js'
    },
    app: {
        head: {
            title: 'djspot-fe',
            htmlAttrs: {
                lang: 'en'
            },
            meta: [
                { key: 'description', name: 'description', content: '' },
                { name: 'format-detection', content: 'telephone=no' }
            ],
            link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
        }
    },
    css: ['~/assets/css/main.css'],
    routeRules: {
        '/directus/**': { proxy: proxyUrl }
    },
    plugins: [
        { src: '~/plugins/audio.ts' },
        { src: '~/plugins/media.js' },
        { src: '~/plugins/time.js' },
        { src: '~/plugins/marked.js' },
        { src: '~/plugins/api/index.js' }
    ],
    components: true,
    modules: [
        '@nuxt/ui',
        '@nuxtjs/i18n',
        '@pinia/nuxt',
        'pinia-plugin-persistedstate/nuxt',
        '@nuxt/content',
        '@nuxt/devtools',
        '@nuxt/eslint'
    ],
    content: {
        watch: {
            ws: {
                hostname: '127.0.0.1'
            }
        }
    },
    i18n: {
        defaultLocale: 'cs',
        strategy: 'no_prefix',
detectBrowserLanguage: {
            useCookie: true,
            cookieKey: 'i18n_locale',
            alwaysRedirect: false,
            fallbackLocale: 'cs'
        },
        locales: [
            {
                code: 'en',
                name: 'English',
                language: 'en-US',
                file: 'en.json'
            },
            {
                code: 'cs',
                name: 'Čeština',
                language: 'cs',
                file: 'cs.json'
            }
        ]
    },
    runtimeConfig: {
        public: {
            baseURL: process.env.BASE_URL || 'http://127.0.0.1:3000',
            apiBaseURL: process.env.API_BASE_URL || 'http://127.0.0.1:8055'
        }
    }
});
