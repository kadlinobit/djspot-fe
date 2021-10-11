import Url from 'url-parse'
import _ from 'lodash'

export default (context, inject) => {
    function isValidUrl(url) {
        try {
            // eslint-disable-next-line no-new
            new URL(url)
        } catch (e) {
            return false
        }
        return true
    }

    function getDropboxUrls(parsedUrl) {
        const audioUrls = {}

        parsedUrl.set('query', { raw: 1 })
        audioUrls.stream = parsedUrl.toString()

        parsedUrl.set('query', { dl: 1 })
        audioUrls.download = parsedUrl.toString()

        return audioUrls
    }

    async function getHearThisUrls(parsedUrl) {
        const audioUrls = {
            stream: null,
            download: null
        }

        try {
            const response = await context.app.$axios.get(
                `https://api-v2.hearthis.at${parsedUrl.pathname}`
            )

            if (response.data) {
                audioUrls.stream = response.data.stream_url || null
                audioUrls.download = response.data.download_url || null
            }
        } catch (e) {
            // console.warn(e)
        }
        return audioUrls
    }

    async function getAudioUrls(url) {
        if (!isValidUrl(url)) {
            return null
        }

        const parsedUrl = new Url(url, true)
        let audioUrls

        if (parsedUrl.host.includes('dropbox.com')) {
            audioUrls = getDropboxUrls(parsedUrl)
        } else if (parsedUrl.host.includes('hearthis.at')) {
            audioUrls = await getHearThisUrls(parsedUrl)
        } else {
            audioUrls = {
                stream: url,
                download: url
            }
        }
        return audioUrls
    }

    function convertTimeHHMMSS(seconds) {
        const hhmmss = new Date(seconds * 1000).toISOString().substr(11, 8)
        return hhmmss.indexOf('00:') === 0 ? hhmmss.substr(3) : hhmmss
    }

    function formatSoundForPlaylist(sound) {
        return _.pick(sound, ['duration', 'dj', 'id', 'name', 'type', 'url'])
    }

    const api = {
        getAudioUrls,
        convertTimeHHMMSS,
        formatSoundForPlaylist
    }

    inject('audio', api)
}
