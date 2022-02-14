export const state = () => ({
    defaultCoverImages: {
        sound: {
            url: '/images/sound-cover.png'
        },
        dj: {
            url: '/images/dj-cover.jpg'
        }
    }
})
export const getters = {
    getDefaultCoverImage: (state) => (type) => {
        return state.defaultCoverImages[type].url
    }
}
