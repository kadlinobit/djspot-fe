import Vue from 'vue'
import Oruga from '@oruga-ui/oruga'
import { bulmaConfig } from '@oruga-ui/theme-bulma'

const config = Object.assign(bulmaConfig, {
    notification: {
        ...bulmaConfig.notification,
        duration: 6000,
        closable: true
    }
})

Vue.use(Oruga, config)
