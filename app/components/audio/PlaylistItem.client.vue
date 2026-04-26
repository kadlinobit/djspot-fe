<template>
    <li class="flex items-center gap-3 py-2 px-3 border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors rounded-lg group">
        <div class="flex-shrink-0 cursor-move text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 playlist-item-handle">
            <UIcon name="i-heroicons-arrows-up-down" class="w-5 h-5" />
        </div>
        <div class="flex-shrink-0">
            <button-play-pause :sound="playlistItem" variant="text" />
        </div>
        <div class="flex-1 min-w-0 truncate">
            <span @click="mainStore.setIsPlaylistOpen(false)">
                <nuxt-link
                    :to="`/djs/${playlistItem.dj.slug}/sounds/${playlistItem.id}`"
                    class="font-medium text-gray-900 dark:text-white hover:text-primary-500 transition-colors"
                >
                    {{ `${playlistItem.dj.name} – ${playlistItem.name}` }}
                </nuxt-link>
            </span>
        </div>

        <div class="flex-shrink-0">
            <UBadge :color="soundTagColor" variant="soft" class="text-xs capitalize">
                {{ $i18n.t(`${playlistItem.type}.type`) }}
            </UBadge>
        </div>
        <div class="flex-shrink-0">
            <button-playlist-add-remove :sound="playlistItem" />
        </div>
    </li>
</template>

<script setup lang="ts">
import { useMainStore } from '~/stores'
import ButtonPlayPause from '~/components/audio/ButtonPlayPause.client.vue'
import ButtonPlaylistAddRemove from '~/components/audio/ButtonPlaylistAddRemove.client.vue'

const { $i18n } = useNuxtApp()
const mainStore = useMainStore()

const props = defineProps({
    playlistItem: {
        type: Object,
        required: true
    }
})

const soundTagColor = computed(() => {
    switch (props.playlistItem.type) {
        case 'mix':
            return 'primary'
        case 'track':
            return 'success'
        default:
            return 'neutral'
    }
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
