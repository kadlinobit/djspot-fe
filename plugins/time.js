// import _ from 'lodash'
import dayjs from 'dayjs'
import 'dayjs/locale/de'
import 'dayjs/locale/cs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
    dayjs.extend(relativeTime)

    function fromNow(dateString) {
        return dayjs(dateString).locale(nuxtApp.$i18n.locale).fromNow()
    }

    const api = {
        fromNow
    }

    nuxtApp.provide('time', api)
})
