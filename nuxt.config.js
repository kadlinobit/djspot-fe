import eslintPlugin from 'vite-plugin-eslint';

export default defineNuxtConfig({
    // vite: {
    //     plugins: [eslintPlugin()]
    // },
    // Global page headers: https://go.nuxtjs.dev/config-head
    alias: {
        tslib: 'tslib/tslib.es6.js'
    },
    debug: false,
    // TODO - Add @vueuse/head to be able to use new useHead composable
    head: {
        title: 'djspot-fe',
        htmlAttrs: {
            lang: 'en'
        },
        meta: [
            { charset: 'utf-8' },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1'
            },
            { hid: 'description', name: 'description', content: '' },
            { name: 'format-detection', content: 'telephone=no' }
        ],
        link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
    },

    // Global CSS: https://go.nuxtjs.dev/config-css
    css: [
        '~/assets/scss/main.scss',
        '@mdi/font/css/materialdesignicons.min.css'
    ],
    routeRules: {
        '/directus/**': { proxy: import.meta.env.API_URL }
    },
    // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
    plugins: [
        { src: '~/plugins/audio.js' },
        { src: '~/plugins/media.js' },
        { src: '~/plugins/time.js' },
        { src: '~/plugins/oruga.js' },
        { src: '~/plugins/marked.js' },
        { src: '~/plugins/api/index.js' },
        { src: '~/plugins/theme.client' }
    ],

    // Auto import components: https://go.nuxtjs.dev/config-components
    components: true,

    // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
    buildModules: [
        // https://go.nuxtjs.dev/eslint
    ],

    // Modules: https://go.nuxtjs.dev/config-modules
    modules: [
        '@nuxtjs/i18n',
        '@pinia/nuxt',
        'pinia-plugin-persistedstate/nuxt',
        '@nuxt/content',
        '@nuxt/devtools'
    ],
    content: {
        navigation: {
            fields: ['description']
        },
        watch: {
            ws: {
                hostname: '127.0.0.1'
            }
        }
    },
    i18n: {
        defaultLocale: 'cs',
        locales: [
            {
                code: 'en',
                name: 'English',
                iso: 'en-US',
                file: 'en.json'
            },
            {
                code: 'cs',
                name: 'Čeština',
                iso: 'cs',
                file: 'cs.json'
            }
        ]
    },
    // Build Configuration: https://go.nuxtjs.dev/config-build
    build: {
        extend(config, ctx) {
            if (ctx.isDev) {
                config.devtool = ctx.isClient
                    ? 'source-map'
                    : 'inline-source-map';
            }
        }
    },
    runtimeConfig: {
        public: {
            baseURL: process.env.BASE_URL || 'http://127.0.0.1:3000',
            apiBaseURL: 'http://127.0.0.1:8055'
        }
    }
});
