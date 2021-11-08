// import _ from 'lodash'
import dayjs from 'dayjs'
import 'dayjs/locale/de'
import 'dayjs/locale/cs'
import relativeTime from 'dayjs/plugin/relativeTime'

export default (context, inject) => {
    dayjs.extend(relativeTime)

    function fromNow(dateString) {
        return dayjs(dateString).locale(context.app.i18n.locale).fromNow()
    }

    const api = {
        fromNow
    }

    inject('time', api)
}
