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
    css: [
        '~/assets/scss/main.scss',
        '@mdi/font/css/materialdesignicons.min.css' // TBD - probably remove
    ],

    // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
    plugins: [
        { src: '~plugins/axios', ssr: true },
        { src: '~/plugins/vee-validate.js', ssr: false },
        { src: '~/plugins/audio.js' },
        { src: '~/plugins/media.js' },
        { src: '~/plugins/time.js' },
        { src: '~/plugins/oruga.js' },
        { src: '~/plugins/marked.js' },
        { src: '~/plugins/vue-dompurify-html.js', ssr: false }, // TODO - REMOVE
        { src: '~/plugins/persisted-state.client.js' }
    ],

    // Auto import components: https://go.nuxtjs.dev/config-components
    components: true,

    // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
    buildModules: [
        // https://go.nuxtjs.dev/eslint
        '@nuxtjs/eslint-module',
        '@nuxtjs/strapi'
    ],

    // Modules: https://go.nuxtjs.dev/config-modules
    modules: [
        // https://go.nuxtjs.dev/axios
        '@nuxtjs/axios',
        '@nuxtjs/auth',
        '@nuxtjs/i18n'
    ],

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
        baseURL: 'http://localhost:1337'
    },
    /*
     ** Auth module configuration
     ** See https://auth.nuxtjs.org/schemes/local.html#options
     */
    // TBD - probably remove
    auth: {
        strategies: {
            local: {
                endpoints: {
                    login: {
                        url: 'auth/local',
                        method: 'post',
                        propertyName: 'jwt'
                    },
                    user: {
                        url: 'users/me',
                        method: 'get',
                        propertyName: false
                    },
                    logout: false
                }
            }
        }
    },
    strapi: {
        url: process.env.STRAPI_URL || 'http://localhost:1337',
        version: 'v3',
        key: 'strapi_jwt',
        expires: '31d',
        cookie: {
            sameSite: 'lax',
            path: '/'
        }
    },
    // Build Configuration: https://go.nuxtjs.dev/config-build
    build: {
        transpile: ['vee-validate/dist/rules']
    },

    publicRuntimeConfig: {
        API_AUTH_URL: 'http://localhost:1337', // TBD - probably remove
        DOMAIN: 'http://localhost:1337'
    },
    privateRuntimeConfig: {}
})
