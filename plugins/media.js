import _ from 'lodash'

export default (context, inject) => {
    /**
     * Returns image URL in selected quality. If selected quality is not available, function returns
     * the highest possible quality below the selected one. If quality is not specified, original image
     * quality URL is returned (the highest quality possible).
     * @param {object} image - {url, formats: {large, medium, small, thumbnail}} image object
     * @param {string} quality - desired photo quality - 'large', 'medium', 'small', 'thumbnail' or empty
     * @param {string} baseUrl - baseUrl for absolute path - default 'http://localhost:1337'
     */
    function getImageUrl(image, quality, baseUrl = 'http://localhost:1337') {
        const qualities = ['large', 'medium', 'small', 'thumbnail']

        if (!image) return null

        if (!quality || !qualities.includes(quality)) return baseUrl + image.url

        let imageUrl

        for (let i = qualities.indexOf(quality); i < qualities.length; i++) {
            if (!_.isEmpty(image.formats[qualities[i]])) {
                imageUrl = image.formats[qualities[i]].url
                break
            }
        }

        if (!imageUrl) imageUrl = image.url

        return baseUrl + imageUrl
    }

    const api = {
        getImageUrl
    }

    inject('media', api)
}
