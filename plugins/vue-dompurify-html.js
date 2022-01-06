// TODO - REMOVE
import VueDOMPurifyHTML from 'vue-dompurify-html'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(VueDOMPurifyHTML, {
        property: {
            id: 'VueDomPurify'
        }
    })
})
