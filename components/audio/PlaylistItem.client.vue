<template>
    <li class="columns is-mobile is-vcentered is-gapless playlist-item">
        <div class="column is-narrow playlist-item-handle mr-1">
            <o-icon icon="swap-vertical" />
        </div>
        <div class="column is-narrow mr-1">
            <button-play-pause :sound="playlistItem" />
        </div>
        <div class="column is-text-ellipsis">
            <span @click="mainStore.setIsPlaylistOpen(false)">
                <nuxt-link
                    :to="`/djs/${playlistItem.dj.slug}/sounds/${playlistItem.id}`"
                >
                    {{ `${playlistItem.dj.name} – ${playlistItem.name}` }}
                </nuxt-link>
            </span>
        </div>

        <div class="column is-narrow">
            <span :class="['tag', soundTagType]">{{
                $i18n.t(`${playlistItem.type}.type`)
            }}</span>
        </div>
        <div class="column is-narrow">
            <button-playlist-add-remove :sound="playlistItem" />
        </div>
    </li>
</template>

<script setup lang="ts">
import { useMainStore } from '~/stores'
import ButtonPlayPause from '~~/components/audio/ButtonPlayPause.client.vue'
import ButtonPlaylistAddRemove from '~~/components/audio/ButtonPlaylistAddRemove.client.vue'

const { $i18n } = useNuxtApp()
const mainStore = useMainStore()

const props = defineProps({
    playlistItem: {
        type: Object,
        required: true
    }
})

const soundTagType = computed(() => {
    let tagType
    switch (props.playlistItem.type) {
        case 'mix':
            tagType = 'is-primary'
            break
        case 'track':
            tagType = 'is-success'
            break
    }
    return tagType
})
</script>

<style lang="scss" scoped>
.playlist-item-handle {
    cursor: move;
}

.playlist-item-delete {
    cursor: pointer;
}
</style>
