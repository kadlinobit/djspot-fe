import { marked } from 'marked'
import DOMPurify from 'isomorphic-dompurify'

marked.setOptions({
    renderer: new marked.Renderer(),
    pedantic: false,
    gfm: true,
    breaks: true,
    headerIds: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    xhtml: false
})

marked.use({
    renderer: {
        heading(text, level) {
            return `<h4 class="title is-4">${text}</h4>`
        },
        image(text) {
            return text
        }
    }
})

function escapeHtml(input: string): string {
    return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
}

export function markdownToHtml(input: unknown): unknown {
    if (typeof input !== 'string') return input
    return DOMPurify.sanitize(marked(escapeHtml(input)) as string)
}
