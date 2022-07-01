import Url from 'url-parse'
import _ from 'lodash'
import base64 from 'base-64'
import utf8 from 'utf8'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
    /**
     * Function that decides whether string is a valid URL
     * @param {string} url - URL in string format
     * @returns {boolean} - true if URL string is valid, false otherwise
     */
    function isValidUrl(url) {
        try {
            // eslint-disable-next-line no-new
            new URL(url)
        } catch (e) {
            return false
        }
        return true
    }
    /**
     * Returns stream and download URLs of a Dropbox file
     * @param {Object} parsedUrl - Url object (from url-parse library)
     * @returns {Object} - {stream, download} object with URLs to stream and download audio
     */
    function getDropboxUrls(parsedUrl) {
        const audioUrls = {}

        parsedUrl.set('query', { raw: 1 })
        audioUrls.stream = parsedUrl.toString()

        parsedUrl.set('query', { dl: 1 })
        audioUrls.download = parsedUrl.toString()

        return audioUrls
    }
    /**
     * Returns stream and download URLs of a Hearthis.at file
     * @param {Object} parsedUrl - Url object (from url-parse library)
     * @returns {Object} - {stream, download} object with URLs to stream and download audio
     */
    function getHearThisUrls(parsedUrl) {
        const audioUrls = {
            stream: null,
            download: null
        }

        audioUrls.stream = `https://hearthis.app${parsedUrl.pathname}listen`

        // try {
        //     const response = await context.app.$axios.get(
        //         `https://api-v2.hearthis.at${parsedUrl.pathname}`
        //     )

        //     if (response.data) {
        //         audioUrls.stream = response.data.stream_url || null
        //         audioUrls.download = response.data.download_url || null
        //     }
        // } catch (e) {
        //     // console.warn(e)
        // }
        return audioUrls
    }
    /**
     * Returns stream and download URLs of a MS OneDrive file
     * @param {Object} parsedUrl - Url object (from url-parse library)
     * @returns {Object} - {stream, download} object with URLs to stream and download audio
     */
    function getOneDriveUrls(parsedUrl) {
        const audioUrls = {
            stream: null,
            download: null
        }

        const base64value = base64.encode(utf8.encode(parsedUrl.toString()))
        const encodedUrl = base64value.replace(/=+$/, '').replace('/', '_').replace('+', '-')
        const resultUrl = `https://api.onedrive.com/v1.0/shares/u!${encodedUrl}/root/content`

        audioUrls.stream = resultUrl
        audioUrls.download = resultUrl

        return audioUrls
    }
    /**
     * Returns stream and download URLs of a general URL (based on URL type decides which type of storage is used)
     * @param {string} url - Sharing URL of the audio file
     * @returns {Object} - {stream, download} object with URLs to stream and download audio
     */
    async function getAudioUrls(url) {
        if (!isValidUrl(url)) {
            return null
        }

        const parsedUrl = new Url(url, true)
        let audioUrls

        // Dropbox.com
        if (parsedUrl.host.includes('dropbox.com')) {
            audioUrls = getDropboxUrls(parsedUrl)
        }
        // Hearthis.at
        else if (parsedUrl.host.includes('hearthis.at')) {
            audioUrls = await getHearThisUrls(parsedUrl)
        }
        // OneDrive
        else if (parsedUrl.host.includes('1drv.ms')) {
            audioUrls = getOneDriveUrls(parsedUrl)
        }
        // Own hosting
        else {
            audioUrls = {
                stream: url,
                download: url
            }
        }
        return audioUrls
    }
    /**
     * Converts number of seconds into time in "hh:mm:ss" format
     * @param {number} seconds - number of seconds
     * @returns {string} - time in format "hh:mm:ss"
     */
    function convertTimeHHMMSS(seconds) {
        const hhmmss = new Date(seconds * 1000).toISOString().substr(11, 8)
        return hhmmss.indexOf('00:') === 0 ? hhmmss.substr(3) : hhmmss
    }

    /**
     * Returns new Sound object with selected keys only {duration, dj, id, name, type, url}
     * @param {Object} sound - Sound object {id, name, dj etc.}
     * @returns {Object} - new Sound object with keys selected for playlist
     */
    function formatSoundForPlaylist(sound) {
        return _.pick(sound, ['duration', 'dj', 'id', 'name', 'type', 'url'])
    }

    const api = {
        getAudioUrls,
        convertTimeHHMMSS,
        formatSoundForPlaylist
    }

    nuxtApp.provide('audio', api)
})
