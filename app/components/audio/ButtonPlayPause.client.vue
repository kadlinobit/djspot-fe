<template>
    <UButton
        v-if="
            !playerStore.currentSound ||
            playerStore.currentSound.id !== sound.id
        "
        v-bind="$attrs"
        :disabled="playerStore.isLoading"
        variant="ghost"
        icon="i-heroicons-play"
        @click.prevent="() => onPlayNewSound(sound)"
    />
    <UButton
        v-if="
            playerStore.currentSound && playerStore.currentSound.id === sound.id
        "
        v-bind="$attrs"
        :disabled="playerStore.isLoading"
        variant="ghost"
        :icon="playerStore.isPlaying ? 'i-heroicons-pause' : 'i-heroicons-play'"
        @click.prevent="() => playerStore.setIsPlaying(!playerStore.isPlaying)"
    />
</template>

<script setup lang="ts">
import { usePlayerStore, usePlaylistStore } from '~/stores';

import type { ISoundDefault } from '~/plugins/directus/collection';
const playerStore = usePlayerStore();
const playlistStore = usePlaylistStore();

interface Props {
    sound: ISoundDefault;
}

defineOptions({ inheritAttrs: false });
const props = defineProps<Props>();

function onPlayNewSound(sound: ISoundDefault) {
    playlistStore.handlePlaySound(sound);
    playerStore.loadNewAudio(sound);
}
</script>
