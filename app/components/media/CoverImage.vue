<template>
    <div class="cover-image" :style="ICoverImageStyle"></div>
</template>

<script setup lang="ts">
import { useMediaStore } from '~/stores';
const mediaStore = useMediaStore();
const { $media } = useNuxtApp();
import type { CSSProperties } from 'vue';

const { baseURL } = useRuntimeConfig().public;

interface Props {
    coverImage?: string;
    coverType?: string;
    quality?: string;
    pixelSize?: number;
}

const props = withDefaults(defineProps<Props>(), {
    coverType: 'sound'
});

const coverImageUrl = computed(() => {
    if (props.coverImage) {
        return $media.getImageUrl(props.coverImage, props.quality);
    } else {
        return `${baseURL}${mediaStore.getDefaultCoverImage(props.coverType)}`;
    }
});
const ICoverImageStyle = computed(() => {
    const style: CSSProperties = {};
    style.backgroundImage = `url(${coverImageUrl.value})`;
    if (props.pixelSize) {
        style.width = `${props.pixelSize}px`;
        style.height = `${props.pixelSize}px`;
    } else {
        style.width = `100%`;
        style.paddingTop = `100%`;
    }
    return style;
});
</script>

<style lang="scss" scoped>
.cover-image {
    background-size: cover;
    background-position: center center;
    border-radius: 10px;
    filter: sepia(60%);
}
</style>
