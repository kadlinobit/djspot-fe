<template>
    <div v-if="coverImageUrl" class="cover-image" :style="coverImageStyle"></div>
    <avatar v-else square :variant="avatarVariant" :style="avatarStyle" :name="name" :colors="['#923EA5', '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1']" />
</template>

<script setup lang="ts">
import { useMediaStore } from '~/stores';
const mediaStore = useMediaStore();
const { $media } = useNuxtApp();
import type { CSSProperties } from 'vue';
import Avatar from "vue-boring-avatars";

const { baseURL } = useRuntimeConfig().public;

interface Props {
    name: string;
    coverImage?: string;
    coverType?: 'dj' | 'sound' | 'user';
    quality?: string;
    pixelSize?: number;
}

const props = withDefaults(defineProps<Props>(), {
    coverType: 'sound'
});

const coverImageUrl = computed(() => {
    if (props.coverImage) {
        return $media.getImageUrl(props.coverImage, props.quality);
    } 
});

const avatarVariant = computed(() => {
    switch (props.coverType) {
        case 'dj':
            return 'beam';
        case 'sound':
            return 'bauhaus';
        case 'user':
            return 'beam';
        default:
            return 'beam';
    }
});

const avatarStyle = computed(() => {
    const style: CSSProperties = {};
    if (props.pixelSize) {
        style.width = `${props.pixelSize}px`;
        style.height = `${props.pixelSize}px`;
    } else {
        style.width = `100%`;
        // style.height = `100%`;
    }
    return style;
});

const coverImageStyle = computed(() => {
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
