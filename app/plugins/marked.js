import { marked } from 'marked'
import DOMPurify from 'isomorphic-dompurify'
import { defineNuxtPlugin } from '#app'

marked.setOptions({
    renderer: new marked.Renderer(),
    highlight: false,
    pedantic: false,
    gfm: true,
    tables: true,
    breaks: true,
    headerIds: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    xhtml: false
})

const renderer = {
    heading(text, level, raw, slugger) {
        // return `<h${level} class="title is-${level}">${text}</h${level}>`
        return `<h4 class="title is-4">${text}</h4>`
    },
    image(text) {
        return text
    }
}

marked.use({ renderer })

export default defineNuxtPlugin((nuxtApp) => {
    function markdownToHtml(input) {
        if (typeof input !== 'string') return input
        return DOMPurify.sanitize(marked(escapeHtml(input)))
    }

    function escapeHtml(input) {
        return input
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;')
    }

    const api = {
        markdownToHtml
    }

    nuxtApp.provide('marked', api)
})
