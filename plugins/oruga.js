import Vue from 'vue'
import Oruga from '@oruga-ui/oruga'
import { bulmaConfig } from '@oruga-ui/theme-bulma'

console.log(bulmaConfig)
// const config = Object.assign(bulmaConfig, {
//     notification: {
//         ...bulmaConfig.notification
//         // duration: 70000,
//         // closable: true
//     }
// })

Vue.use(Oruga, bulmaConfig)
