import file from './file.js'
import collection from './collection.js'
import tools from './tools.js'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
    const api = {
        file: file(nuxtApp.$axios),
        collection: collection(),
        tools: tools()
    }

    nuxtApp.provide('api', api)
})
