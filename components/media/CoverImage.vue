<template>
    <div class="cover-image" :style="coverImageStyle"></div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    props: {
        coverImage: {
            type: String,
            default: null
        },
        coverType: {
            type: String,
            default: 'sound'
        },
        quality: {
            type: String,
            default: null
        },
        pixelSize: {
            type: Number,
            default: null
        }
    },
    computed: {
        ...mapGetters('media', ['getDefaultCoverImage']),
        coverImageUrl() {
            if (this.coverImage) {
                return this.$media.getImageUrl(this.coverImage, this.quality)
            } else {
                return 'http://localhost:3000' + this.getDefaultCoverImage(this.coverType)
            }
        },
        coverImageStyle() {
            const style = {}
            style.backgroundImage = `url(${this.coverImageUrl})`
            if (this.pixelSize) {
                style.width = `${this.pixelSize}px`
                style.height = `${this.pixelSize}px`
            } else {
                style.width = `100%`
                style.paddingTop = `100%`
            }
            return style
        }
    }
}
</script>

<style lang="scss" scoped>
.cover-image {
    background-size: cover;
    background-position: center center;
    border-radius: 10px;
}
</style>
