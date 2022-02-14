// TBD - PROBABLY REMOVE
import { Directus } from '@directus/sdk'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
    const directus = new Directus('http://localhost:8055')
    nuxtApp.provide('directus', directus)
})
