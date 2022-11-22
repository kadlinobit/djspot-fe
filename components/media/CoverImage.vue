<template>
    <div class="cover-image" :style="coverImageStyle"></div>
</template>

<script setup lang="ts">
import { useMediaStore } from '~/stores'
const mediaStore = useMediaStore()
const { $media } = useNuxtApp()

const { apiBaseURL } = useRuntimeConfig().public

interface Props {
    coverImage?: string
    coverType?: string
    quality?: string
    pixelSize?: number
}

const props = withDefaults(defineProps<Props>(), {
    coverImage: null,
    coverType: 'sound',
    quality: null,
    pixelSize: null
})

const coverImageUrl = computed(() => {
    if (props.coverImage) {
        return $media.getImageUrl(props.coverImage, props.quality)
    } else {
        return `${apiBaseURL}${mediaStore.getDefaultCoverImage(
            props.coverType
        )}`
    }
})
const coverImageStyle = computed(() => {
    interface CoverImageStyle {
        backgroundImage?: string
        width?: string
        height?: string
        paddingTop?: string
    }

    const style: CoverImageStyle = {}
    style.backgroundImage = `url(${coverImageUrl.value})`
    if (props.pixelSize) {
        style.width = `${props.pixelSize}px`
        style.height = `${props.pixelSize}px`
    } else {
        style.width = `100%`
        style.paddingTop = `100%`
    }
    return style
})
</script>

<style lang="scss" scoped>
.cover-image {
    background-size: cover;
    background-position: center center;
    border-radius: 10px;
}
</style>
