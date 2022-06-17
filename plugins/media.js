// import _ from 'lodash'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
    /**
     * Returns image URL in selected quality. If selected quality is not available, function returns
     * the highest possible quality below the selected one. If quality is not specified, original image
     * quality URL is returned (the highest quality possible).
     * @param {object} image - {url, formats: {large, medium, small, thumbnail}} image object
     * @param {string} quality - desired photo quality - 'large', 'medium', 'small', 'thumbnail' or empty
     * @param {string} baseUrl - baseUrl for absolute path - default 'http://localhost:8055/assets'
     */
    function getImageUrl(imageId, quality, baseUrl = 'http://localhost:8055/assets') {
        // const qualities = ['large', 'medium', 'small', 'thumbnail']

        if (!imageId) return null

        return `${baseUrl}/${imageId}`
    }

    async function getCroppedImageBlob(imageObj) {
        if (!imageObj.croppedImage)
            throw new Error('Cropped image not present in provided image object.')

        const { canvas } = imageObj.croppedImage
        if (!canvas) throw new Error('Canvas object not present in provided image object.')

        const blob = await new Promise((resolve) => canvas.toBlob(resolve))

        return blob
    }

    const api = {
        getImageUrl,
        getCroppedImageBlob
    }

    nuxtApp.provide('media', api)
})
