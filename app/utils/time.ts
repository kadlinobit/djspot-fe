import dayjs from 'dayjs'
import 'dayjs/locale/de'
import 'dayjs/locale/cs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export function convertTimeHHMMSS(seconds: number): string {
    const hhmmss = new Date(seconds * 1000).toISOString().substr(11, 8);
    return hhmmss.indexOf('00:') === 0 ? hhmmss.substr(3) : hhmmss;
}

export function fromNow(dateString: string) {
    const { $i18n } = useNuxtApp()
    return dayjs(dateString).locale($i18n.locale.value).fromNow()
}
