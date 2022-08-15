import { defineStore } from 'pinia'

export const useMediaStore = defineStore('media', () => {
    const defaultCoverImages = ref({
        sound: {
            url: '/images/sound-cover.png'
        },
        dj: {
            url: '/images/dj-cover.jpg'
        }
    })

    // GETTERS
    const getDefaultCoverImage = (type) => {
        return defaultCoverImages.value[type].url
    }

    return {
        defaultCoverImages,

        // GETTERS
        getDefaultCoverImage
    }
})
