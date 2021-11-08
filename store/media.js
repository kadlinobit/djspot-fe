export const state = () => ({
    defaultCoverImages: {
        sound: {
            url: '/images/sound-cover.png',
            formats: {
                large: {
                    url: '/images/sound-cover.png'
                },
                medium: {
                    url: '/images/sound-cover.png'
                },
                small: {
                    url: '/images/sound-cover.png'
                },
                thumbnail: {
                    url: '/images/sound-cover.png'
                }
            }
        },
        dj: {
            url: '/images/dj-cover.jpg',
            formats: {
                large: {
                    url: '/images/dj-cover.jpg'
                },
                medium: {
                    url: '/images/dj-cover.jpg'
                },
                small: {
                    url: '/images/dj-cover.jpg'
                },
                thumbnail: {
                    url: '/images/dj-cover.jpg'
                }
            }
        }
    }
})
export const getters = {
    getDefaultCoverImage: (state) => (type) => {
        console.log('returning', state.defaultCoverImages[type])
        return state.defaultCoverImages[type]
    }
}
