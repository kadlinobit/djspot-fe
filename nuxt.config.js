import i18n from './config/i18n'

export default {
    // Global page headers: https://go.nuxtjs.dev/config-head
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
    css: [],

    // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
    plugins: [
        { src: '~plugins/axios', ssr: true },
        { src: '~/plugins/vee-validate.js', ssr: false },
        { src: '~/plugins/v-markdown-editor.js', mode: 'client', ssr: false }
    ],

    // Auto import components: https://go.nuxtjs.dev/config-components
    components: true,

    // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
    buildModules: [
        // https://go.nuxtjs.dev/eslint
        '@nuxtjs/eslint-module',
        [
            'nuxt-i18n',
            {
                vueI18nLoader: true,
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
            }
        ]
    ],

    // Modules: https://go.nuxtjs.dev/config-modules
    modules: [
        // https://go.nuxtjs.dev/buefy
        'nuxt-buefy',
        // https://go.nuxtjs.dev/axios
        '@nuxtjs/axios',
        '@nuxtjs/auth',
        '@nuxtjs/strapi'
    ],

    // Axios module configuration: https://go.nuxtjs.dev/config-axios
    axios: {
        baseURL: 'http://localhost:1337'
    },
    /*
     ** Auth module configuration
     ** See https://auth.nuxtjs.org/schemes/local.html#options
     */
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
    strapi: {},
    // Build Configuration: https://go.nuxtjs.dev/config-build
    build: {
        transpile: ['vee-validate/dist/rules']
    },

    publicRuntimeConfig: {
        API_AUTH_URL: 'http://localhost:1337'
    },
    privateRuntimeConfig: {}
}
