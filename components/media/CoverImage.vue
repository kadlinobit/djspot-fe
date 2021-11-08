<template>
    <div
        class="cover-image"
        :style="{
            backgroundImage: `url(${coverImageUrl})`,
            width: `${pixelSize}px`,
            height: `${pixelSize}px`
        }"
    ></div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    props: {
        coverImage: {
            type: Object,
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
            default: 300
        }
    },
    computed: {
        ...mapGetters('media', ['getDefaultCoverImage']),
        coverImageUrl() {
            if (this.coverImage) {
                return this.$media.getImageUrl(this.coverImage, this.quality)
            } else {
                return this.$media.getImageUrl(
                    this.getDefaultCoverImage(this.coverType),
                    this.quality,
                    ''
                )
            }
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
