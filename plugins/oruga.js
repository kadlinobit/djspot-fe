import Oruga from '@oruga-ui/oruga'
import { bulmaConfig } from '@oruga-ui/theme-bulma'

const config = Object.assign(bulmaConfig, {
    notification: {
        ...bulmaConfig.notification,
        duration: 7000,
        closable: true
    }
})
export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(Oruga, bulmaConfig)
})
