<template>
    <USlideover
        v-model:open="mainStore.isPlaylistOpen"
        side="bottom"
        title="Playlist"
    >
        <template #body>
            <Playlist />
        </template>
    </USlideover>
</template>

<script setup lang="ts">
import Playlist from '~/components/audio/Playlist.client.vue';
import { useMainStore } from '~/stores';

const mainStore = useMainStore();
</script>
