import { defineNuxtConfig } from '@nuxt/bridge'
import i18n from './config/i18n'

export default defineNuxtConfig({
    // Global page headers: https://go.nuxtjs.dev/config-head
    alias: {
        tslib: 'tslib/tslib.es6.js'
    },
    // bridge: false,
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
    css: ['~/assets/scss/main.scss', '@mdi/font/css/materialdesignicons.min.css'],

    // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
    plugins: [
        { src: '~/plugins/vee-validate.client.js', ssr: false },
        { src: '~/plugins/audio.js' },
        { src: '~/plugins/media.js' },
        { src: '~/plugins/time.js' },
        { src: '~/plugins/oruga.js' },
        { src: '~/plugins/marked.js' },
        { src: '~/plugins/api/index.js' }
    ],

    // Auto import components: https://go.nuxtjs.dev/config-components
    components: true,

    // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
    buildModules: [
        // https://go.nuxtjs.dev/eslint
        '@nuxtjs/eslint-module'
    ],

    // Modules: https://go.nuxtjs.dev/config-modules
    modules: [
        // https://go.nuxtjs.dev/axios
        '@nuxtjs/axios',
        '@nuxtjs/auth-next',
        '@nuxtjs/i18n',
        'nuxt-directus'
    ],
    directus: {
        url: 'http://localhost:8055',
        fetchUserParams: {
            fields: ['*', 'djs.*']
        },
        autoFetch: true
    },
    i18n: {
        vueI18nLoader: true,
        strategy: 'no_prefix',
        defaultLocale: 'cs',
        seo: true,
        locales: [
            {
                code: 'en',
                name: 'English',
                iso: 'en-US'
            },
            {
                code: 'cs',
                name: 'Čeština',
                iso: 'cs'
            }
        ],
        vueI18n: i18n
    },
    // Axios module configuration: https://go.nuxtjs.dev/config-axios
    axios: {
        baseURL: 'http://localhost:8055'
    },
    /*
     ** Auth module configuration
     ** See https://auth.nuxtjs.org/schemes/local.html#options
     */

    auth: {
        strategies: {
            local: {
                scheme: 'refresh',
                token: {
                    property: 'data.access_token',
                    maxAge: 900000,
                    global: true
                    // type: 'Bearer'
                },
                refreshToken: {
                    property: 'data.refresh_token',
                    data: 'refresh_token',
                    maxAge: 60 * 60 * 24 * 7
                },
                user: {
                    property: 'data'
                    // autoFetch: true
                },
                endpoints: {
                    login: { url: '/auth/login', method: 'post' },
                    refresh: { url: '/auth/refresh', method: 'post' },
                    user: { url: '/users/me?fields=*,djs.*', method: 'get' }, // TBD - update fields loaded on user fetch
                    logout: { url: '/auth/logout', method: 'post' }
                }
                // autoLogout: false
            }
        }
    },
    // Build Configuration: https://go.nuxtjs.dev/config-build
    build: {
        transpile: ['vee-validate/dist/rules'],
        extend(config, ctx) {
            if (ctx.isDev) {
                config.devtool = ctx.isClient ? 'source-map' : 'inline-source-map'
            }
        }
    },

    publicRuntimeConfig: {
        API_AUTH_URL: 'http://localhost:1337', // TBD - probably remove
        DOMAIN: 'http://localhost:1337'
    },
    privateRuntimeConfig: {}
})
