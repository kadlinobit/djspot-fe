export default defineI18nConfig(() => ({
    vueI18nLoader: true,
    strategy: 'no_prefix',
    defaultLocale: 'cs',
    langDir: 'locales/',
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
    ]
}))
